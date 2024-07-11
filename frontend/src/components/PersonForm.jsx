const PersonForm = (props) =>{
    return (
        <form onSubmit={props.AddName}>
            <table>
                <tbody>
                    <tr>
            
                <td>name: </td><td><input value={props.newName} onChange={props.handleNameChange}/></td>
            
            </tr>
            <tr>
             <td>number:</td><td> <input value={props.newNumber} onChange={props.handleNumberChange}/></td>
            </tr>
            </tbody>
            </table>
            
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm