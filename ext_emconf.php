<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'AJAX Pagination',
    'description' => 'Extension providing full functionality for AJAX pagination for passed content objects',
    'category' => 'plugin',
    'author' => '',
    'author_email' => '',
    'state' => 'stable',
    'internal' => '',
    'uploadfolder' => false,
    'createDirs' => '',
    'clearCacheOnLoad' => 0,
    'version' => '1.0.0',
    'constraints' => [
        'depends' => [
            'typo3' => '8.7.0-8.7.99',
            'typoscript_rendering' => '2.0.0-99.99.99'
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];
