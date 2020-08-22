### Routers

- `GET /api/1`, `GET /api/2` - Returns stations of PS1 and PS2 respectively. Request Parameters:
  - `limit` - the number of stations to return
  - `skip` 
  - `location` - regex search for the name of the location of the station
  - `name` - regex search for name of station
    - Example: `/api/1?name=amazon&location=bangalore&limit=5&skip=10`
    
- `GET /api/course` - Returns courses. Request Parameters:
  - `limit` - the number of stations to return
  - `skip`
  - `number` - regex search for number of the course
  - `title` - regex search for number of the course
    - Example: `/api/course?number=bio&title=biotechnology&limit=5&skip=10`
    
- `GET /api/1/:station`, `GET /api/2/:station` - Returns the details of the station. (:station is the slugified of the station)
  - Example `/api/1/yale-university`
  
- `GET /api/course/:number` - Returns the details of the course. (:station is the slugified number of the course)
  - Example `/api/course/bio-f211`
  
- `POST /api/1/:station/comment`, `POST /api/2/:station/comment`, `POST /api/1/:station/comment`: post a comment in the discussion threads.
  - Requires `Authorization` Header with Bearer token.
  - Body:
  ```
  {
    "data": "comment text"
  }
  ```
  
- `POST /api/1/:station/:commentId/reply`, `POST /api/2/:station/:commentId/reply`, `POST /api/course/:number/:commentId/reply`: post a reply to a comment in the discussion threads.
  - Requires `Authorization` Header with Bearer token.
  - Body:
  ```
  {
    "data": "comment text"
  }
  ```
  
  
