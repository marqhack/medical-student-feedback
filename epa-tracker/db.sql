-- phpMyAdmin SQL Dump
-- version 4.0.10.17
-- https://www.phpmyadmin.net
--
-- Host: mydb5.cs.unc.edu
-- Generation Time: Oct 22, 2016 at 12:30 AM
-- Server version: 5.1.73
-- PHP Version: 5.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `medtrackdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `Advisees`
--

CREATE TABLE IF NOT EXISTS `Advisees` (
  `advisor` int(11) NOT NULL,
  `student` int(11) NOT NULL,
  PRIMARY KEY (`advisor`,`student`),
  KEY `student` (`student`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Advisees`
--

INSERT INTO `Advisees` (`advisor`, `student`) VALUES
(3, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `EPAHistory`
--

CREATE TABLE IF NOT EXISTS `EPAHistory` (
  `hid` int(11) NOT NULL AUTO_INCREMENT,
  `student` int(11) NOT NULL,
  `epaid` int(11) NOT NULL,
  `title` varchar(100) NOT NULL COMMENT 'the title of the test',
  `uploaded` datetime NOT NULL,
  `newval` int(11) NOT NULL,
  PRIMARY KEY (`hid`),
  KEY `student` (`student`),
  KEY `epaid` (`epaid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `EPAHistory`
--

INSERT INTO `EPAHistory` (`hid`, `student`, `epaid`, `title`, `uploaded`, `newval`) VALUES
(1, 1, 1, '', '2016-10-18 12:47:08', 3),
(2, 1, 1, '', '2016-10-18 13:12:28', 3),
(3, 1, 2, '', '2016-10-18 13:12:28', 3),
(4, 1, 3, '', '2016-10-18 13:12:28', 1),
(5, 1, 4, '', '2016-10-18 13:12:28', 2),
(6, 1, 5, '', '2016-10-18 13:12:28', 4);

-- --------------------------------------------------------

--
-- Table structure for table `EPAs`
--

CREATE TABLE IF NOT EXISTS `EPAs` (
  `epaid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `desc` text,
  PRIMARY KEY (`epaid`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

--
-- Dumping data for table `EPAs`
--

INSERT INTO `EPAs` (`epaid`, `name`, `desc`) VALUES
(1, 'Gather a history and perform a physical examination', NULL),
(2, 'Prioritize a differential diagnosis following a clinical encounter', NULL),
(3, 'Recommend and interpret common diagnostic and screening tests', NULL),
(4, 'Enter and discuss orders and prescriptions', NULL),
(5, 'Document a clinical encounter in the patient record', NULL),
(6, 'Provide an oral presentation of a clinical encounter', NULL),
(7, 'Form clinical questions and retrieve evidence to advance patient care', NULL),
(8, 'Give or receive a patient handover to transition care responsibility', NULL),
(9, 'Collaborate as a member of an interprofessional team', NULL),
(10, 'Recognize a patient requiring urgent or emergent care and initiate evaluation and management', NULL),
(11, 'Obtain informed consent for tests and/or procedures', NULL),
(12, 'Perform general procedures of a physician', NULL),
(13, 'Identify system failures and contribute to a culture of safety and improvement', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `UpdateComments`
--

CREATE TABLE IF NOT EXISTS `UpdateComments` (
  `cid` int(11) NOT NULL,
  `hid` int(11) NOT NULL,
  `aid` int(11) NOT NULL,
  `body` text,
  PRIMARY KEY (`cid`),
  KEY `hid` (`hid`),
  KEY `aid` (`aid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE IF NOT EXISTS `Users` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(25) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `permissions` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 COMMENT='something may need adding in later for external auth' AUTO_INCREMENT=4 ;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`uid`, `username`, `fname`, `lname`, `permissions`) VALUES
(1, 'lkrink', 'Lindsay', 'Krinkle', 0),
(2, 'abcooper', 'Amy', 'Cooper', 0),
(3, 'jcaswell', 'Jim', 'Caswell', 1);
