#### mesto_deploy_of_backend
##### https://placeimage.space/
##### http://84.201.175.135/

Version v0.0.2
Description: mesto_deploy_of_backend

<li> все ошибки обрабатываются централизованно;
<li> тела запросов и, где необходимо, заголовки и параметры, валидируются по определённым схемам. Если запрос не соответствует схеме, обработка не передаётся контроллеру и клиент получает ошибку валидации;
<li> все запросы и ответы записываются в файл request.log;
<li> все ошибки записываются в файл error.log;
<li> файлы логов не добавляются в репозиторий;
<li> к серверу можно обратиться по публичному IP-адресу, указанному в README.md;
<li> к серверу можно обратиться по http и по https, используя домен, указанный в README.md;
<li> секретный ключ для создания и верификации JWT хранится на сервере в .env файле. Этот файл не добавляется в git;
<li> в режиме разработки (когда process.env.NODE_ENV !== 'production') код запускается и работает без наличия .env файла;
<li> сервер самостоятельно восстанавливается после GET-запроса на URL /crash-test.




 