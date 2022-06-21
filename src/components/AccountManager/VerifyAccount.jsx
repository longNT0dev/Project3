import React from 'react'

function VerifyAccount() {
  const handleVerifyAccount = () => {
    
  }
  return (
    <ul className="mt-3" style={{listStyle: 'none'}}>
      <li>
        Cung cấp giấy tờ tùy thân (cmnd,cccd, license drive)
      </li>
      <li>
        Cung cấp giấy tờ sở hữu và sử dụng đất
      </li>

      <li>
        <button className="btn btn-primary" onClick={() => handleVerifyAccount}>Xác thực</button>
      </li>
    </ul>
  )
}

export default VerifyAccount