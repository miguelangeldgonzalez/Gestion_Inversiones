<?php

include 'db.php';

echo json_encode(query('users', "", "`nombres`, `apellidos`, `id`"));

?>