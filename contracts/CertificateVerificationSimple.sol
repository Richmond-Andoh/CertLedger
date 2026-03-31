// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CertificateVerification
 * @dev Simplified blockchain-based academic certificate verification system
 * @author CertLedger Team
 * @notice This contract stores SHA-256 hashes of academic certificates for immutable verification
 */
contract CertificateVerification {
    
    // Struct to store certificate metadata
    struct Certificate {
        string certificateId;        // Unique certificate identifier
        string hash;                // SHA-256 hash of all certificate fields
        address issuer;              // University admin who issued it
        uint256 timestamp;          // When certificate was issued
        bool isActive;              // Certificate status
        string institution;         // Institution name (off-chain reference)
    }
    
    // Struct for anomaly tracking
    struct AnomalyRecord {
        string certificateId;
        string reason;
        uint256 timestamp;
        address reporter;
    }
    
    // State variables
    uint256 private certificateCount;
    uint256 private anomalyCount;
    
    // Mappings for efficient lookups
    mapping(string => Certificate) private certificates;  // certificateId => Certificate
    mapping(string => bool) private hashExists;           // hash => exists
    mapping(address => bool) private authorizedIssuers;  // address => authorized
    mapping(uint256 => AnomalyRecord) private anomalies; // anomalyId => AnomalyRecord
    
    // Arrays for enumeration
    string[] private certificateList;
    uint256[] private anomalyList;
    
    // Events for transparency and monitoring
    event CertificateIssued(
        string indexed certificateId,
        string indexed hash,
        address indexed issuer,
        string institution,
        uint256 timestamp
    );
    
    event CertificateVerified(
        string indexed certificateId,
        bool isValid,
        uint256 timestamp
    );
    
    event AnomalyDetected(
        uint256 indexed anomalyId,
        string indexed certificateId,
        string reason,
        address indexed reporter,
        uint256 timestamp
    );
    
    event IssuerAuthorized(address indexed issuer, string institution);
    event IssuerDeauthorized(address indexed issuer);
    
    // Modifiers
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "CertificateVerification: Caller is not an authorized issuer");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "CertificateVerification: Caller is not the owner");
        _;
    }
    
    modifier certificateExists(string memory certificateId) {
        require(certificates[certificateId].timestamp > 0, "CertificateVerification: Certificate does not exist");
        _;
    }
    
    modifier validHash(string memory hash) {
        require(bytes(hash).length == 64, "CertificateVerification: Invalid hash length");
        _;
    }
    
    address private owner;
    
    /**
     * @dev Constructor to initialize contract
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Authorizes a university admin to issue certificates
     * @param issuer The address to authorize
     * @param institution The institution name for this issuer
     */
    function authorizeIssuer(address issuer, string memory institution) external onlyOwner {
        require(issuer != address(0), "CertificateVerification: Invalid issuer address");
        require(bytes(institution).length > 0, "CertificateVerification: Institution name required");
        
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer, institution);
    }
    
    /**
     * @dev Deauthorizes a university admin
     * @param issuer The address to deauthorize
     */
    function deauthorizeIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "CertificateVerification: Issuer not authorized");
        authorizedIssuers[issuer] = false;
        emit IssuerDeauthorized(issuer);
    }
    
    /**
     * @dev Issues a new certificate by storing its hash on blockchain
     * @param certificateId Unique identifier for certificate
     * @param hash SHA-256 hash of all certificate fields combined
     * @param institution Name of issuing institution
     * @return success Whether certificate was successfully issued
     */
    function issueCertificate(
        string memory certificateId,
        string memory hash,
        string memory institution
    ) 
        external 
        onlyAuthorizedIssuer 
        validHash(hash)
        returns (bool success) 
    {
        // Check for duplicate hash (anomaly detection)
        if (hashExists[hash]) {
            _recordAnomaly(certificateId, "Duplicate hash detected");
            revert("CertificateVerification: Duplicate hash detected - possible fraud");
        }
        
        // Check for duplicate certificate ID
        require(certificates[certificateId].timestamp == 0, "CertificateVerification: Certificate ID already exists");
        
        // Create and store certificate
        certificates[certificateId] = Certificate({
            certificateId: certificateId,
            hash: hash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isActive: true,
            institution: institution
        });
        
        // Update mappings and arrays
        hashExists[hash] = true;
        certificateList.push(certificateId);
        certificateCount++;
        
        emit CertificateIssued(certificateId, hash, msg.sender, institution, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Verifies a certificate by comparing its hash with stored hash
     * @param certificateId The certificate ID to verify
     * @param hash The computed hash of certificate details
     * @return isValid Whether certificate is valid
     * @return timestamp When certificate was issued
     * @return institution The issuing institution
     */
    function verifyCertificate(string memory certificateId, string memory hash) 
        external 
        view 
        certificateExists(certificateId)
        returns (bool isValid, uint256 timestamp, string memory institution) 
    {
        Certificate memory cert = certificates[certificateId];
        
        isValid = cert.isActive && keccak256(bytes(cert.hash)) == keccak256(bytes(hash));
        timestamp = cert.timestamp;
        institution = cert.institution;
    }
    
    /**
     * @dev Checks if a hash already exists in system
     * @param hash The hash to check
     * @return exists Whether hash exists
     */
    function checkDuplicateHash(string memory hash) external view returns (bool exists) {
        return hashExists[hash];
    }
    
    /**
     * @dev Retrieves certificate details (for student portal)
     * @param certificateId The certificate ID to retrieve
     * @return hash The stored hash
     * @return issuer The address of issuer
     * @return timestamp When it was issued
     * @return isActive Whether certificate is active
     * @return institution The issuing institution
     */
    function getCertificateDetails(string memory certificateId) 
        external 
        view 
        certificateExists(certificateId)
        returns (string memory hash, address issuer, uint256 timestamp, bool isActive, string memory institution) 
    {
        Certificate memory cert = certificates[certificateId];
        return (cert.hash, cert.issuer, cert.timestamp, cert.isActive, cert.institution);
    }
    
    /**
     * @dev Records an anomaly for monitoring and fraud detection
     * @param certificateId The certificate ID involved
     * @param reason The reason for anomaly
     */
    function _recordAnomaly(string memory certificateId, string memory reason) internal {
        anomalies[anomalyCount] = AnomalyRecord({
            certificateId: certificateId,
            reason: reason,
            timestamp: block.timestamp,
            reporter: msg.sender
        });
        
        anomalyList.push(anomalyCount);
        anomalyCount++;
        
        emit AnomalyDetected(anomalyCount, certificateId, reason, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Manually reports an anomaly (for system admin)
     * @param certificateId The certificate ID involved
     * @param reason The reason for anomaly
     */
    function reportAnomaly(string memory certificateId, string memory reason) external onlyOwner {
        _recordAnomaly(certificateId, reason);
    }
    
    /**
     * @dev Gets total number of certificates issued
     * @return count Total certificates
     */
    function getTotalCertificates() external view returns (uint256 count) {
        return certificateCount;
    }
    
    /**
     * @dev Gets total number of anomalies reported
     * @return count Total anomalies
     */
    function getTotalAnomalies() external view returns (uint256 count) {
        return anomalyCount;
    }
    
    /**
     * @dev Checks if an address is an authorized issuer
     * @param issuer The address to check
     * @return isAuthorized Whether address is authorized
     */
    function isAuthorizedIssuer(address issuer) external view returns (bool isAuthorized) {
        return authorizedIssuers[issuer];
    }
    
    /**
     * @dev Gets certificate IDs for pagination (admin function)
     * @param offset Starting index
     * @param limit Number of certificates to return
     * @return certificateIds Array of certificate IDs
     */
    function getCertificateIds(uint256 offset, uint256 limit) external view onlyOwner returns (string[] memory certificateIds) {
        uint256 end = offset + limit;
        if (end > certificateList.length) {
            end = certificateList.length;
        }
        
        certificateIds = new string[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            certificateIds[i - offset] = certificateList[i];
        }
    }
    
    /**
     * @dev Gets anomaly records for admin dashboard
     * @param offset Starting index
     * @param limit Number of anomalies to return
     * @return anomalyIds Array of anomaly IDs
     * @return certificateIds Array of certificate IDs
     * @return reasons Array of reasons
     * @return timestamps Array of timestamps
     * @return reporters Array of reporter addresses
     */
    function getAnomalies(uint256 offset, uint256 limit) 
        external 
        view 
        onlyOwner 
        returns (
            uint256[] memory anomalyIds,
            string[] memory certificateIds,
            string[] memory reasons,
            uint256[] memory timestamps,
            address[] memory reporters
        ) 
    {
        uint256 end = offset + limit;
        if (end > anomalyList.length) {
            end = anomalyList.length;
        }
        
        anomalyIds = new uint256[](end - offset);
        certificateIds = new string[](end - offset);
        reasons = new string[](end - offset);
        timestamps = new uint256[](end - offset);
        reporters = new address[](end - offset);
        
        for (uint256 i = offset; i < end; i++) {
            uint256 anomalyId = anomalyList[i];
            AnomalyRecord memory anomaly = anomalies[anomalyId];
            
            anomalyIds[i - offset] = anomalyId;
            certificateIds[i - offset] = anomaly.certificateId;
            reasons[i - offset] = anomaly.reason;
            timestamps[i - offset] = anomaly.timestamp;
            reporters[i - offset] = anomaly.reporter;
        }
    }
}
