import React, { Component } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";

export default class View extends Component {
  state= {
    title:'',
    content:''
  }

  detail = () => {
    let url = window.location.href;
    let urlParams = url.split('?')[1];
    console.log(urlParams); // id = 5
    // let url = '?id=2';

    const searchParams = new URLSearchParams(urlParams); // {id:5}
    console.log(searchParams); // 1, 2
    let id = searchParams.get('id'); 

    Axios.get(`http://localhost:8000/detail?id=${id}`) // get 방식으로 조회해 줄래
      .then((res) => {
        // const data = res.data; 아래처럼 작성한 것 과 같음
        const { data } = res; // destructuring 비구조 할당
        // console.log(data); 0 : {BOARD_TITLE: '제목1', BOARD_CONTENT: '내용1'}
        this.setState({
          title : data[0].BOARD_TITLE,
          content : data[0].BOARD_CONTENT
        })
      })
      .catch((e) => {
        // 에러 핸들링
        console.log(e);
      });
  }

  componentDidMount() {

      this.detail();

  }

  render() {
    return (     
      <div>
        <h2>{this.state.title}</h2>
        <h2>본문</h2>
        {this.state.content}
        <hr />
        <Link to="/" className="btn btn-secondary">목록</Link>  
      </div>      
    )
  }
}