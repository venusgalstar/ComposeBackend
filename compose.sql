/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 100411
 Source Host           : localhost:3306
 Source Schema         : compose

 Target Server Type    : MySQL
 Target Server Version : 100411
 File Encoding         : 65001

 Date: 22/12/2022 13:40:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for chain
-- ----------------------------
DROP TABLE IF EXISTS `chain`;
CREATE TABLE `chain`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `rpc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `explorer` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chain
-- ----------------------------
INSERT INTO `chain` VALUES (1, 'ethereum_mainnet', 'https://mainnet.infura.io/v3/57b59f4ada61437eb6c386afae37ec80', 'https://etherscan.io/tx/');
INSERT INTO `chain` VALUES (2, 'fuji', 'https://api.avax-test.network/ext/bc/C/rpc', 'https://testnet.snowtrace.io/tx/');

-- ----------------------------
-- Table structure for nft
-- ----------------------------
DROP TABLE IF EXISTS `nft`;
CREATE TABLE `nft`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `chain_id` int NULL DEFAULT NULL,
  `chain_contract_addr` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `contract_addr` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `block_num` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of nft
-- ----------------------------
INSERT INTO `nft` VALUES (1, 1, '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', NULL, 190000);
INSERT INTO `nft` VALUES (2, 2, '0x7412441Ab9Bd26aEF0Fe28f8E0bf88bFfa5Fa587', '0x482a93BaE69b971e371a95dA69b5C3b4f9ADc790', 17163280);

SET FOREIGN_KEY_CHECKS = 1;
