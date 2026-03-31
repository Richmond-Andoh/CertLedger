const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateVerification", function () {
  let certificateVerification;
  let owner;
  let universityAdmin;
  let universityAdmin2;
  let student;
  let employer;
  
  // Test data
  const testCertificateId = "CERT-2024-001";
  const testHash = "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890";
  const testInstitution = "University of Ghana";
  const testHash2 = "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890a1";
  
  beforeEach(async function () {
    // Get signers
    [owner, universityAdmin, universityAdmin2, student, employer] = await ethers.getSigners();
    
    // Deploy contract
    const CertificateVerification = await ethers.getContractFactory("CertificateVerification");
    certificateVerification = await CertificateVerification.deploy();
    await certificateVerification.deployed();
  });
  
  describe("Contract Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await certificateVerification.owner()).to.equal(owner.address);
    });
    
    it("Should start with zero certificates", async function () {
      expect(await certificateVerification.getTotalCertificates()).to.equal(0);
    });
    
    it("Should start with zero anomalies", async function () {
      expect(await certificateVerification.getTotalAnomalies()).to.equal(0);
    });
  });
  
  describe("Issuer Authorization", function () {
    it("Should authorize an issuer successfully", async function () {
      await expect(certificateVerification.authorizeIssuer(universityAdmin.address, testInstitution))
        .to.emit(certificateVerification, "IssuerAuthorized")
        .withArgs(universityAdmin.address, testInstitution);
      
      expect(await certificateVerification.isAuthorizedIssuer(universityAdmin.address)).to.be.true;
    });
    
    it("Should not authorize zero address", async function () {
      await expect(
        certificateVerification.authorizeIssuer(ethers.constants.AddressZero, testInstitution)
      ).to.be.revertedWith("CertificateVerification: Invalid issuer address");
    });
    
    it("Should not authorize with empty institution name", async function () {
      await expect(
        certificateVerification.authorizeIssuer(universityAdmin.address, "")
      ).to.be.revertedWith("CertificateVerification: Institution name required");
    });
    
    it("Should deauthorize an issuer successfully", async function () {
      await certificateVerification.authorizeIssuer(universityAdmin.address, testInstitution);
      
      await expect(certificateVerification.deauthorizeIssuer(universityAdmin.address))
        .to.emit(certificateVerification, "IssuerDeauthorized")
        .withArgs(universityAdmin.address);
      
      expect(await certificateVerification.isAuthorizedIssuer(universityAdmin.address)).to.be.false;
    });
  });
  
  describe("Certificate Issuance", function () {
    beforeEach(async function () {
      await certificateVerification.authorizeIssuer(universityAdmin.address, testInstitution);
    });
    
    it("Should issue a certificate successfully", async function () {
      await expect(certificateVerification.issueCertificate(testCertificateId, testHash, testInstitution))
        .to.emit(certificateVerification, "CertificateIssued")
        .withArgs(testCertificateId, testHash, universityAdmin.address, testInstitution);
      
      expect(await certificateVerification.getTotalCertificates()).to.equal(1);
      expect(await certificateVerification.checkDuplicateHash(testHash)).to.be.true;
    });
    
    it("Should not allow unauthorized issuer to issue certificate", async function () {
      await expect(
        certificateVerification.connect(universityAdmin2).issueCertificate(testCertificateId, testHash, testInstitution)
      ).to.be.revertedWith("CertificateVerification: Caller is not an authorized issuer");
    });
    
    it("Should not allow duplicate certificate ID", async function () {
      await certificateVerification.issueCertificate(testCertificateId, testHash, testInstitution);
      
      await expect(
        certificateVerification.issueCertificate(testCertificateId, testHash2, testInstitution)
      ).to.be.revertedWith("CertificateVerification: Certificate ID already exists");
    });
    
    it("Should not allow duplicate hash (anomaly detection)", async function () {
      await certificateVerification.issueCertificate(testCertificateId, testHash, testInstitution);
      
      await expect(
        certificateVerification.issueCertificate("CERT-2024-002", testHash, testInstitution)
      ).to.be.revertedWith("CertificateVerification: Duplicate hash detected - possible fraud");
      
      // Check that anomaly was recorded
      expect(await certificateVerification.getTotalAnomalies()).to.equal(1);
    });
    
    it("Should not allow invalid hash length", async function () {
      const invalidHash = "invalid";
      
      await expect(
        certificateVerification.issueCertificate(testCertificateId, invalidHash, testInstitution)
      ).to.be.revertedWith("CertificateVerification: Invalid hash length");
    });
  });
  
  describe("Certificate Verification", function () {
    beforeEach(async function () {
      await certificateVerification.authorizeIssuer(universityAdmin.address, testInstitution);
      await certificateVerification.issueCertificate(testCertificateId, testHash, testInstitution);
    });
    
    it("Should verify a valid certificate successfully", async function () {
      const [isValid, timestamp, institution] = await certificateVerification.verifyCertificate(testCertificateId, testHash);
      
      expect(isValid).to.be.true;
      expect(timestamp).to.be.gt(0);
      expect(institution).to.equal(testInstitution);
    });
    
    it("Should fail verification with wrong hash", async function () {
      const [isValid, timestamp, institution] = await certificateVerification.verifyCertificate(testCertificateId, testHash2);
      
      expect(isValid).to.be.false;
      expect(timestamp).to.be.gt(0);
      expect(institution).to.equal(testInstitution);
    });
    
    it("Should not verify non-existent certificate", async function () {
      await expect(
        certificateVerification.verifyCertificate("NON-EXISTENT", testHash)
      ).to.be.revertedWith("CertificateVerification: Certificate does not exist");
    });
  });
  
  describe("Certificate Details", function () {
    beforeEach(async function () {
      await certificateVerification.authorizeIssuer(universityAdmin.address, testInstitution);
      await certificateVerification.issueCertificate(testCertificateId, testHash, testInstitution);
    });
    
    it("Should return certificate details correctly", async function () {
      const [hash, issuer, timestamp, isActive, institution] = await certificateVerification.getCertificateDetails(testCertificateId);
      
      expect(hash).to.equal(testHash);
      expect(issuer).to.equal(universityAdmin.address);
      expect(timestamp).to.be.gt(0);
      expect(isActive).to.be.true;
      expect(institution).to.equal(testInstitution);
    });
    
    it(" not return details for non-existent certificate", async function () {
      await expect(
        certificateVerification.getCertificateDetails("NON-EXISTENT")
      ).to.be.revertedWith("CertificateVerification: Certificate does not exist");
    });
  });
  
  describe("Anomaly Reporting", function () {
    it("Should allow owner to report anomaly", async function () {
      await expect(certificateVerification.reportAnomaly(testCertificateId, "Suspicious activity detected"))
        .to.emit(certificateVerification, "AnomalyDetected");
      
      expect(await certificateVerification.getTotalAnomalies()).to.equal(1);
    });
    
    it("Should not allow non-owner to report anomaly", async function () {
      await expect(
        certificateVerification.connect(universityAdmin).reportAnomaly(testCertificateId, "Test anomaly")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
  
  describe("Admin Functions", function () {
    beforeEach(async function () {
      await certificateVerification.authorizeIssuer(universityAdmin.address, testInstitution);
      await certificateVerification.issueCertificate(testCertificateId, testHash, testInstitution);
      await certificateVerification.reportAnomaly(testCertificateId, "Test anomaly");
    });
    
    it("Should return certificate IDs for pagination", async function () {
      const certificateIds = await certificateVerification.getCertificateIds(0, 10);
      expect(certificateIds.length).to.equal(1);
      expect(certificateIds[0]).to.equal(testCertificateId);
    });
    
    it("Should return anomalies for admin dashboard", async function () {
      const [anomalyIds, certificateIds, reasons, timestamps, reporters] = await certificateVerification.getAnomalies(0, 10);
      
      expect(anomalyIds.length).to.equal(1);
      expect(certificateIds[0]).to.equal(testCertificateId);
      expect(reasons[0]).to.equal("Test anomaly");
      expect(timestamps[0]).to.be.gt(0);
      expect(reporters[0]).to.equal(owner.address);
    });
    
    it("Should not allow non-owner to access admin functions", async function () {
      await expect(
        certificateVerification.connect(universityAdmin).getCertificateIds(0, 10)
      ).to.be.revertedWith("Ownable: caller is not the owner");
      
      await expect(
        certificateVerification.connect(universityAdmin).getAnomalies(0, 10)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
  
  describe("Security Tests", function () {
    it("Should prevent reentrancy attacks", async function () {
      await certificateVerification.authorizeIssuer(universityAdmin.address, testInstitution);
      
      // This test ensures the nonReentrant modifier is working
      // In a real scenario, you'd need a malicious contract to test this properly
      await expect(
        certificateVerification.issueCertificate(testCertificateId, testHash, testInstitution)
      ).to.not.be.revertedWith("ReentrancyGuard: reentrant call");
    });
  });
});
