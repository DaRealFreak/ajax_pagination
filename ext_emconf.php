<?php

$EM_CONF[$_EXTKEY] = [
    'title' => 'AJAX Pagination',
    'description' => 'Extension providing full functionality for AJAX pagination for passed content objects',
    'category' => 'plugin',
    'author' => 'Steffen Keuper',
    'author_email' => 'steffen.keuper@d-mind.de',
    'state' => 'stable',
    'internal' => '',
    'uploadfolder' => false,
    'createDirs' => '',
    'clearCacheOnLoad' => 0,
    'version' => '1.0.1',
    'constraints' => [
        'depends' => [
            'typo3' => '8.7.0-9.5.99',
            'typoscript_rendering' => '2.0.0-99.99.99'
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
];
