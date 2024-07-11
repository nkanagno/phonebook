const Filter = (props) =>{
return (
    <div>
        filter: <input type="search" value={props.searchName} onChange={props.handleSearchNameChange}/>
    </div>
)
}
export default Filter