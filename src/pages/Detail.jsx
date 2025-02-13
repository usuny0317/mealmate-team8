// import {useEffect, useState} from "react"
import DetailHeader from "../components/Detail/DetailHeader"
import DetailAction from "../components/Detail/DetailAction"
import DetailContent from "../components/Detail/DetailContent"
import CommentSection from "../components/Detail/CommentSection"
import CommonHeader from "../components/common/Header"
import { useLocation } from "react-router-dom"

//디테일 페이지
const Detail = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const postId = query.get("postId");
  
  return (
  <div>
    <CommonHeader></CommonHeader>
    <DetailHeader author={postMessage.author}/>
    <DetailContent image={postMessage.author} title={postMessage.title} content={postMessage.content} />
    <DetailAction postId={postId} likes={postMessage.likes} />
    <CommentSection postId={postId} />
  </div>
  );
};

export default Detail;
