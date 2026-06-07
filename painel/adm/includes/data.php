<?php
function normalizeRowKeys($row) {
    foreach ($row as $key => $value) {
        $lowerKey = strtolower($key);
        if (!array_key_exists($lowerKey, $row)) {
            $row[$lowerKey] = $value;
        }
    }
    return $row;
}

function qSELECT($query, $object = NULL) {
    global $conn;
    $result = mysqli_query($conn, $query);
    $return = [];

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $return[] = is_null($object) ? normalizeRowKeys($row) : (object) normalizeRowKeys($row);
        }
    }

    return $return;
}

function counting($table, $what) {
    global $conn;
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
    $result = mysqli_query($conn, "SELECT COUNT(1) AS total FROM {$table}");
    $row = $result ? mysqli_fetch_assoc($result) : ['total' => 0];
    return $row['total'] ?? 0;
}

function getById($table, $id) {
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
    $id = (int) $id;
    $result = qSELECT("SELECT * FROM {$table} WHERE id={$id}");
    return $result ? $result[0] : $result;
}

function getByIdd($table) {
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
    $result = qSELECT("SELECT * FROM {$table} WHERE agentid=2");
    return $result ? $result[0] : $result;
}

function getByAg($table) {
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
    $adminId = (int) ($_COOKIE['admin_id'] ?? 0);
    $result = qSELECT("SELECT * FROM {$table} WHERE agentid={$adminId}");
    return $result ? $result[0] : $result;
}

function getAll($table) {
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
    $adminId = (int) ($_COOKIE['admin_id'] ?? 0);
    return qSELECT("SELECT * FROM {$table} WHERE agentid={$adminId}");
}

function getAG($table) {
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
    $adminId = (int) ($_COOKIE['admin_id'] ?? 0);
    return qSELECT("SELECT * FROM {$table} WHERE id={$adminId}");
}

function queryToSelect($table, $where, $operator, $zero_value, $key, $value, $id) {
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', $table);
    $where = preg_replace('/[^a-zA-Z0-9_]/', '', $where);
    $zero_value = (int) $zero_value;
    $ul = '<option value="'.$zero_value.'">Please select</option>';
    $result = qSELECT("SELECT * FROM {$table} WHERE {$where} {$operator} {$zero_value}");

    foreach ($result as $row) {
        $ul .= '<option value="'.$row[$key].'" ';
        $ul .= $id == $row[$key] ? "selected" : "";
        $ul .= '>'.$row[$value].'</option>';
    }

    return $ul;
}
?>
