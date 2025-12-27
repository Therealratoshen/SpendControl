// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SpendControlDonations
 * @dev Accept ETH and USDC donations with tier-based badges
 * @notice All donations sent directly to creator
 */
contract SpendControlDonations is ReentrancyGuard {
    // Constants
    address public immutable creator;
    IERC20 public immutable usdc;

    // Donation tiers in USD (6 decimals for USDC)
    uint256 public constant BRONZE_TIER = 5 * 1e6;   // $5
    uint256 public constant SILVER_TIER = 15 * 1e6;  // $15
    uint256 public constant GOLD_TIER = 30 * 1e6;    // $30
    uint256 public constant DIAMOND_TIER = 100 * 1e6; // $100

    // ETH price for tier calculations (assuming ~$3000 per ETH)
    uint256 public ethPriceUSD = 3000;

    enum BadgeTier { None, Bronze, Silver, Gold, Diamond }

    // Donor data
    struct Donor {
        uint256 totalDonatedUSD; // In USDC decimals (6)
        BadgeTier badge;
        uint256 donationCount;
        uint256 lastDonationTime;
    }

    // Storage
    mapping(address => Donor) public donors;
    address[] public donorList;

    // Stats
    uint256 public totalDonationsUSD;
    uint256 public totalDonors;

    // Events
    event DonationReceived(
        address indexed donor,
        uint256 amountUSD,
        bool isETH,
        BadgeTier newBadge,
        uint256 timestamp
    );

    event BadgeUpgraded(
        address indexed donor,
        BadgeTier oldBadge,
        BadgeTier newBadge
    );

    event ETHPriceUpdated(uint256 oldPrice, uint256 newPrice);

    constructor(address _usdcAddress) {
        creator = msg.sender;
        usdc = IERC20(_usdcAddress);
    }

    /**
     * @dev Donate ETH
     */
    function donateETH() external payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");

        // Calculate USD value (with 6 decimals to match USDC)
        uint256 amountUSD = (msg.value * ethPriceUSD) / 1e18 * 1e6;

        // Send ETH directly to creator
        (bool success, ) = creator.call{value: msg.value}("");
        require(success, "ETH transfer failed");

        // Update donor stats
        _updateDonor(msg.sender, amountUSD, true);
    }

    /**
     * @dev Donate USDC
     * @param amount Amount of USDC to donate (in smallest units, 6 decimals)
     */
    function donateUSDC(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer USDC directly to creator
        require(
            usdc.transferFrom(msg.sender, creator, amount),
            "USDC transfer failed"
        );

        // Update donor stats
        _updateDonor(msg.sender, amount, false);
    }

    /**
     * @dev Internal function to update donor stats and badge
     */
    function _updateDonor(
        address donor,
        uint256 amountUSD,
        bool isETH
    ) private {
        Donor storage donorData = donors[donor];

        // Track new donor
        if (donorData.donationCount == 0) {
            donorList.push(donor);
            totalDonors++;
        }

        // Update donation stats
        BadgeTier oldBadge = donorData.badge;
        donorData.totalDonatedUSD += amountUSD;
        donorData.donationCount++;
        donorData.lastDonationTime = block.timestamp;
        totalDonationsUSD += amountUSD;

        // Calculate new badge tier
        BadgeTier newBadge = _calculateBadge(donorData.totalDonatedUSD);
        donorData.badge = newBadge;

        // Emit events
        emit DonationReceived(
            donor,
            amountUSD,
            isETH,
            newBadge,
            block.timestamp
        );

        if (newBadge != oldBadge) {
            emit BadgeUpgraded(donor, oldBadge, newBadge);
        }
    }

    /**
     * @dev Calculate badge tier based on total donated
     */
    function _calculateBadge(uint256 totalUSD) private pure returns (BadgeTier) {
        if (totalUSD >= DIAMOND_TIER) return BadgeTier.Diamond;
        if (totalUSD >= GOLD_TIER) return BadgeTier.Gold;
        if (totalUSD >= SILVER_TIER) return BadgeTier.Silver;
        if (totalUSD >= BRONZE_TIER) return BadgeTier.Bronze;
        return BadgeTier.None;
    }

    /**
     * @dev Update ETH price (only creator)
     */
    function updateETHPrice(uint256 newPrice) external {
        require(msg.sender == creator, "Only creator can update price");
        require(newPrice > 0, "Price must be greater than 0");

        uint256 oldPrice = ethPriceUSD;
        ethPriceUSD = newPrice;

        emit ETHPriceUpdated(oldPrice, newPrice);
    }

    /**
     * @dev Get donor information
     */
    function getDonor(address donor) external view returns (
        uint256 totalDonatedUSD,
        BadgeTier badge,
        uint256 donationCount,
        uint256 lastDonationTime
    ) {
        Donor memory donorData = donors[donor];
        return (
            donorData.totalDonatedUSD,
            donorData.badge,
            donorData.donationCount,
            donorData.lastDonationTime
        );
    }

    /**
     * @dev Get top donors (for leaderboard)
     */
    function getTopDonors(uint256 limit) external view returns (
        address[] memory addresses,
        uint256[] memory amounts,
        BadgeTier[] memory badges
    ) {
        uint256 length = donorList.length < limit ? donorList.length : limit;
        addresses = new address[](length);
        amounts = new uint256[](length);
        badges = new BadgeTier[](length);

        // Create a sorted copy (simple bubble sort for small datasets)
        address[] memory sorted = new address[](donorList.length);
        for (uint256 i = 0; i < donorList.length; i++) {
            sorted[i] = donorList[i];
        }

        // Sort by total donated (descending)
        for (uint256 i = 0; i < sorted.length; i++) {
            for (uint256 j = i + 1; j < sorted.length; j++) {
                if (donors[sorted[i]].totalDonatedUSD < donors[sorted[j]].totalDonatedUSD) {
                    address temp = sorted[i];
                    sorted[i] = sorted[j];
                    sorted[j] = temp;
                }
            }
        }

        // Return top N
        for (uint256 i = 0; i < length; i++) {
            addresses[i] = sorted[i];
            amounts[i] = donors[sorted[i]].totalDonatedUSD;
            badges[i] = donors[sorted[i]].badge;
        }

        return (addresses, amounts, badges);
    }

    /**
     * @dev Get total number of donors
     */
    function getDonorCount() external view returns (uint256) {
        return donorList.length;
    }

    /**
     * @dev Calculate USD value of ETH amount
     */
    function calculateETHtoUSD(uint256 ethAmount) external view returns (uint256) {
        return (ethAmount * ethPriceUSD) / 1e18 * 1e6;
    }
}
