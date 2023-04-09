import React from 'react';


function App() {
    return <div className={"container p-4"}>
        <div className="card">
            <div className="card-header">
              Dogs
            </div>
            <div className="card-body">
                <h5 className="card-title">Here's a list of dogs</h5>
                <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quam quam, aliquam scelerisque vulputate. </p>

            </div>
        </div>
    </div>
}

function List(){

    return  <table className="table">
        <thead className="table-dark">
        <tr>
            <td>Name</td>
            <td>Breed</td>
            <td>Heigh in cm</td>
            <td>Weight</td>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>a</td>
            <td>d</td>
            <td>c</td>
        </tr>
        </tbody>
    </table>
}

export default App;
