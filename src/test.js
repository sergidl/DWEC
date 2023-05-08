import React, { useEffect, useRef, useState } from 'react';

function App() {
    const [test, setTest] = useState(0)

    useEffect(() => {
        console.log(test)
        setTest(test)
    },[test])

    return test
}

export default App;