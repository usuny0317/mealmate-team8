const DetailContent = ({image, title, content}) => {

    return (
        <div>
            <image src={image} alt="게시된 이미지" />
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    )
}
export {DetailContent};