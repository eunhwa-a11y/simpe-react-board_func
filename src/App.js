import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BoardList from './BoardList';
import Write from './Write';
import View from './View';
import React, { Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate, redirect } from 'react-router-dom';

export default class App extends Component {
  state = {
    isModifyMode: false, // 수정모드
    isComplete: true, // 렌더 완료(목록 출력 완료)
    boardId: 0, // 수정, 삭제할 글 번호
    redirect_to_write: false, // 주소 변경 상태 추가
    redirect_to_home: false
  }

  handleModify = (checkList) => {
    if (checkList.length === 0) {
      alert('수정할 게시글을 선택하세요');
    } else if (checkList.length > 1) {
      alert('하나의 게시글만 선택하세요');
    }
    this.setState({
      isModifyMode: checkList.length === 1,
      boardId: checkList[0] || 0,
      redirect_to_write: true
    });
  }

  handleCancel = () => {
    this.setState({
      isModifyMode: false,
      isComplete: false,
      boardId: 0,
      redirect_to_home:true
    });
    console.log('app.js handleCancel 실행');
  }

  // 체크하고 수정하기 누르면 페이지 이동을 위해 생명주기 함수 추가
  componentDidUpdate() {
    // 리다이렉트 후 redirect 상태 초기화
    if (this.state.redirect_to_write) {
      this.setState({ redirect_to_write: false });
    }
    if (this.state.redirect_to_home) {
      this.setState({ redirect_to_home: false });
    }
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container mt-3">
          <h1>React Board</h1>
          {this.state.redirect_to_write && <Navigate to="/write" />}
          {this.state.redirect_to_home && <Navigate to="/" />}
          {/* Navigate로 조건부 리다이렉트 */}
          <Routes>
            <Route path="/" element={<BoardList isComplete={this.state.isComplete} handleModify={this.handleModify} />} />
            <Route path="/write" element={<Write 
              isModifyMode={this.state.isModifyMode}
              boardId={this.state.boardId}
              handleCancel={this.handleCancel}
            />}
            />
            <Route path="/view" element={<View />}/>
          </Routes>
          
        </div>
      </BrowserRouter>
    );
  }
}




