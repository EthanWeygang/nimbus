import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Files() {
  //use effect which triggers get all files
  useEffect(() => {
    const allFiles = getAllFiles();

    // for every file add a file card to the flexbox
  
  })

  function getAllFiles(){
    fetch("/api/files",
      { method: "GET",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({})
      }).then((response) => {

      })
  }
  return (
    <div align="center">
      <div display="flex">

      </div>
    </div>
  );
}

export default Files;