const Notification = (props) =>{
    if (props.message === null){
        return
    }

    return(
        <div className={props.type}>
            {props.message}
        </div>
    )
}

export default Notification