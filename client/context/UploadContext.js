import React, { useState } from "react"

const UploadContext = React.createContext([{}, () => {}])

let initialState = {
    showReupload: false
}

const UploadProvider = props => {
  const [state, setState] = useState(initialState)

  return (
    <UploadContext.Provider value={[state, setState]}>
      {props.children}
    </UploadContext.Provider>
  )
}

export { UploadContext, UploadProvider }
