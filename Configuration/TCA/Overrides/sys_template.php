<?php
defined('TYPO3_MODE') || die();

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
    'ajax_pagination',
    'Configuration/TypoScript',
    'AJAX Pagination'
);
