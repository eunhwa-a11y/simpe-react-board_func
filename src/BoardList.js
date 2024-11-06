import React, { useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';
import Axios from "axios";

import { Link } from "react-router-dom";


function Board ({id, title, registerId, date, onCheckboxChange}) {
  return (
    <tr>
      <td>
        <Form.Check // prettier-ignore
          type="checkbox"
          id={`default-checkbox`}
          value={id}
          // 체크가 됐을 때 onCheckboxChange 함수 실행
          onChange={(e) => {
            onCheckboxChange(e.target.checked, e.target.value)
          }} 
        />
      </td>
      <td>{id}</td>
      <td><Link to={`/view/${id}`}>{title}</Link></td>
      <td>{registerId}</td>
      <td>{date}</td>
    </tr>
  )
}

const BoardList = ({isComplete, handleModify}) => {
  const [boardList, setBoardList] = useState([]);
  const [checkList, setCheckList] = useState([]);

  const onCheckboxChange = (checked, id) => {
    setCheckList((prevList) => {
      if(checked){
        // [...prevList, 4] [1, 2, 3, 4] / [...prevList, 3] [1, 2, 3]
        return [...prevList, id]; 
      }else{
        // 사용자가 클릭한 번호와 일치하지 않는 것만 추려내! [1, 2, 3] 1(사용자가 클릭한 거) (3=>? 3 !== 1)
        return prevList.filter(item => item !== id);
      }
    })
  }

  const getList = useCallback(() => {
    Axios.get("http://localhost:8000/list") // 요청을 보냄
      .then((res) => {
        // const data = res.data; 아래처럼 작성한 것 과 같음
        const { data } = res; // destructuring 비구조 할당
        setBoardList(data);
      })
      .catch((e) => {
        // 에러 핸들링
        console.log(e);
      });
  }, []); // useEffect(() => {리스트 조회}, [])

  useEffect(() => {
    getList();
  }, [getList])
  // ↑ 최초 한 번 getList 함수를 실행하고 getList 객체가 변동 사항이 있으면 다시 실행

  useEffect(() => {
    if(isComplete){
      getList();
    }
  }, [isComplete])
  // ↑ 최초 한 번 getList 함수를 실행하고 getList 객체가 변동 사항이 있으면 다시 실행

  const handleDelete = () => {
    if(this.state.checkList.length === 0){
      alert('삭제할 게시글을 선택하세요');
      return;
    }
  
    let boardIDList = checkList.join();
  
    Axios.post('http://localhost:8000/delete', {
      boardIDList
    }) // 요청을 보냄
    .then((res) => {
      getList();
    })
    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });
  
  }

  return(
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>선택</th>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {
            boardList.map(
              item => (<Board
              key={item.BOARD_ID}
              id={item.BOARD_ID}
              title={item.BOARD_TITLE}
              registerId={item.REGISTER_ID}
              date={item.REGISTER_DATE}
              onCheckboxChange={onCheckboxChange}
              />)
            )
          }
        </tbody>
      </Table>
      <div className="d-flex gap-1">
        <Link to="/Write" className="btn btn-primary">글쓰기</Link>
        <Button variant="secondary" onClick={() => {
          handleModify(checkList);
        }}>수정하기</Button>
        <Button variant="danger" onClick={handleDelete}>삭제하기</Button>
      </div>
    </>
  )

}

export default BoardList;

