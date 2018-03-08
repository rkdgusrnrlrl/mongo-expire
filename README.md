# 몽고 expire 기능 설명을 위한 레포

## 목적

- 같이 일하는 분께 MongoDB의 expire 인덱스 기능을 설명하기 위해 만들어졌습니다.
- MongoDB 순수 쿼리를 가깝게 쓰는 것을 목적으로 하고 있어 `mongodb` 라이브러리를 사용하였고, 해당 문서에 몽고 쿼리 역시 작성하는 것을 목적으로 합니다.

## 준비사항

- 같이 일하시는 분이 Docker 가 깔려 있기 때문에 Docker 가 필요 합니다. :whale2:
- Node.js 가 깔려 있어야 하고 8 버전  이상을 요구합니다.
  - `async/await` 를 사용 하기 때문입니다.
- MongoDB 클라이언트를 준비 하는 것이 좋습니다. 
  - [NoSQLBooster](https://nosqlbooster.com/) 가 괜찮습니다. 한글을 쓸수 없다는 치명적은 단점이 없다면.....:sob::sob:
  - url 은 `localhost` 이고 포트는 기본 포트인 27017 입니다.
- 험난한 길이 될 수도 있으니 마음의 준비도 필요 합니다. :smiling_imp:

## 실행 방법

- git clone 으로 소스를 받은 뒤 생성한 폴더로 들어 가 아래의 명령어를 쳐주면 됩니다.

  ```
  $ npm start
  ```

- 해당 명령어를 실행 하면 MongoDB 컨테이너를 띄운뒤 `npm install`  로 라이브러리를 받은 뒤, `node server.js` 를 실행시킵니다.

  - 뭔가 안돌아간다면, 저 역시 슬플 것 같습니다. 😭😭

- 해당 API 는 다음과 같은 기능이 있습니다.

  - 로그를 기록합니다 로그는 다음 형식과 같습니다. `{ event : [ "exit", "enter", "codng", "playing" ], date : <Date> }`
  - 모두 메서드는 GET  입니다.
  - `/`  : log 목록을 전부 보여줍니다.
  - `/<event>`  : exit, enter, codng, playing 중 하나로 들어가면 해당 이벤트가 기록 되고 성공하면 `{ ok : ture }` 가 뜹니다.

- 여러 event 호출하면 이벤트가 기록 된 것 을 볼 수 있습니다.

- 10 초 마다 새로 고침을 하면 하나씩 사라 질.....줄 알았으나 캐쉬 문제로 한번에 사리집니다.

## MongoDB 클라이언트로 하기

- 위의 url 과 포트로 접속할 수 있습니다.

- 아래와 같이 expire 인덱스를 만들 수 있습니다.

  ```
  db.logs.createIndex( { "date": 1 }, { expireAfterSeconds: 10 } )

  ```

- 첫번 째 인지의 키는 어떤필드 생성을 기준으로 할 것 이냐 입니다

- expireAfterSeconds 의 값은 몇 후 후에 삭제 될 지를 지정 해 줍니다.

- 해당 인덱스는 `date` 필드가 생성된지 10 초 뒤에 해당 Document를 삭제 하라 입니다.

- 자 그럼 `log`  를 insert 해 봅시다.

  ```
  db.logs.insert({evnet : "enter", date : new Date()})
  ```

- 해당 쿼리로 생성된 Document는 10 초 뒤 사라질 것 입니다.

- 아래 쿼리를 계속 날려서 사라지는 지 확인 해 봅시다 너무 빨리 사라지면 , expireAfterSeconds 값을 늘리는 것이 좋습니다.

  ```
  db.logs.find({})
  ```
  
## 참고사항
- 이미 존재 하는 데이터에 expire 인덱스를 주는 경우 인덱스를 준 시간 이후 삭제 된다. 인덱스를 만드는 순간 이전 데이터를 인덱스를 주는 것 같다 따라 데이터 양이 많으면 바로(인덱스를 주고 지정시간이 지난후) 삭제 되지 않을 수도 있다. 

## 마무리

- 캐쉬 문제는 귀찮아서 해결 하지 못했습니다. 
- 뭔가 안된다면 기분 탓 입니다.:smiling_imp:
- 도움이 되길 바랍니다. 
- 모르겠다면 제게 연락...하지 마시고 [MongoDB expire 문서](https://docs.mongodb.com/manual/tutorial/expire-data/)를 읽어 봅시다. 우리에겐 구글 번역기가 있습니다.
