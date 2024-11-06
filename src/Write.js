import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Axios from "axios";
import { Navigate, Link } from "react-router-dom";

export default class Write extends Component {
  // Update.js를 만들지 않고 수정할 때 사용 예정
  state = {
    isModifyMode: false,
    title: '',
    content: '',
    redirect:false // 주소 변경 상태 추가(변경을 할지 말지)
  };

  write = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:8000/insert', {
      title: this.state.title,
      content: this.state.content
    }) // 요청을 보냄
    .then((res) => {
      // window.location = 'http://localhost:3000/';
      this.setState({
        redirect : true
      })
    })
    .catch((e) => {
      // 에러 핸들링
      console.log(e);
    });
  };
  
  update = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:8000/update', {
      title: this.state.title,
      content: this.state.content,
      id: this.props.boardId // 수정할 글 번호
    }) // 요청을 보냄
      .then((res) => {
        this.setState({ // setState 함수를 이용해서
          title: '', // title 비워주고
          content: '', // content도 비워준다
          isModifyMode: false // 수정 완료 -> 입력 완료 변경
        })
        this.props.handleCancel();
        // 글 수정 완료 후 수정 모드 -> false로 변경, 목록 다시 조회, boardID 초기화
      })
      .catch((e) => {
        // 에러 핸들링
        console.log(e);
      });
  };

  detail = () => {
    /*글 번호에 맞는 데이터 조회,
    글 결과를 title, content에 반영 그리고 수정 모드를 true로 변경*/
    Axios.get(`http://localhost:8000/detail?id=${this.props.boardId}`) // get 방식으로 조회해 줄래
      .then((res) => {
        // const data = res.data; 아래처럼 작성한 것 과 같음
        const { data } = res; // destructuring 비구조 할당
        // console.log(data); 0 : {BOARD_TITLE: '제목1', BOARD_CONTENT: '내용1'}
        this.setState({
          title : data[0].BOARD_TITLE,
          content : data[0].BOARD_CONTENT,
          isModifyMode : true
        })
      })
      .catch((e) => {
        // 에러 핸들링
        console.log(e);
      });
  }
  /*this.prop.isModifyMode에 변동사항이 생기면 datail 함수 실행,
  componentDidUpdate 함수로 변동 사항이 있는지 없는지 확인하고
  변동사항이 있으면 componentDidUpdate 함수 실행*/
  componentDidUpdate(prevProps) {
    // 수정 모드이고, boardId가 변경되었다면 그 글의 내용을 조회(datail 함수 실행)하자는 내용
    if (this.props.isModifyMode && this.props.boardId !== prevProps.boardId) {
      this.detail();
    }
  }

  componentDidMount() {
    // 수정 모드이고, boardId가 변경되었다면 그 글의 내용을 조회(datail 함수 실행)하자는 내용
    if (this.props.isModifyMode) {
      this.detail();
    }
  }

  handleChange = (e) => {
    this.setState({
      // title: e.target.value
      [e.target.name]:e.target.value // 계산된 속성
    })
    console.log(this.state);
  }

  render() {
    if(this.state.redirect){
      return <Navigate to = "/" />;
    }
    return (
      <Form>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>제목</Form.Label>
          <Form.Control type="text" name="title" placeholder="제목을 입력하세요." value={this.state.title} onChange={this.handleChange} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="content">
          <Form.Label>내용</Form.Label>
          <Form.Control as="textarea" name="content" value={this.state.content} rows={3} onChange={this.handleChange} />
        </Form.Group>
        <div className="d-flex gap-1">
          <Button variant="primary" type="submit" onClick={this.state.isModifyMode ? this.update : this.write}>{this.state.isModifyMode ? '수정완료' : '입력완료'}</Button>
          <Link to="/" className="btn btn-secondary">취소</Link>
        </div>
      </Form>
    );
  }
}
