<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$projectRoot = "C:\\Users\\pedro\\OneDrive\\Documentos\\novacasa\\API-PgSoft-main";

function readProjectEnv($projectRoot) {
    $envPath = $projectRoot . DIRECTORY_SEPARATOR . ".env";
    $env = [];

    if (!file_exists($envPath)) {
        return $env;
    }

    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $env[trim($parts[0])] = trim($parts[1], " \t\n\r\0\x0B\"'");
        }
    }

    return $env;
}

$env = readProjectEnv($projectRoot);

$host = $env["DB_HOST"] ?? "127.0.0.1";
$port = (int) ($env["DB_PORT"] ?? 3306);
$dbname = $env["DB_NAME"] ?? "phillypsapi";
$user = $env["DB_USERNAME"] ?? "phillypsapi";
$password = $env["DB_PASSWORD"] ?? "123456";

$conn = mysqli_connect($host, $user, $password, $dbname, $port);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

mysqli_set_charset($conn, "utf8mb4");
?>
