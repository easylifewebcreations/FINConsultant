// เข้าสู่ระบบ
function Signin(_jsonData) {
  // รับค่าอินพุต
  const data = JSON.parse(_jsonData)
  const sheet = data.sheet
  const username = data.username
  const password = data.password

  let result = FinAppsLibrary.ResultInit(false) // ผลลัพธ์
  const sheetInfo = GetSheetInfo(sheet) // ข้อมูลชีท

  const passwordEncode = FinAppsLibrary.EncodeSignin(username, password) // เข้ารหัสรหัสผ่าน

  // เงื่อนไขที่ใช้ค้นหา
  const criteriaObj = [
    { header: sheetInfo.username, value: username },
    { header: sheetInfo.password, value: passwordEncode }
  ]

  // ค้นหาข้อมูล
  var dataManager = FinAppsLibrary.newDataManager(sheetInfo) // อินสเตนคลาส
  const readData = dataManager.readData(criteriaObj) // ค้นหาข้อมูล
  if (readData.length > 0) { // พบข้อมูล
    const [item] = readData
    if (item.Status === ENABLE) { // สถานะบัญชี เปิดการใช้งาน
      // ลงทะเบียนเซสชั่น
      RegisterSession(item.UserID, username, item.Firstname, item.Lastname, item.ImageLH5, item.Level)
      result.state = true
      result.message = GREETING_MSG_HELLO
    } else { // สถานะบัญชี ปิดการใช้งาน
      result.state = false
      result.message = SIGNINOUT_MSG_ACCOUNT_DISABLED
    }
  } else { // ไม่พบข้อมูล
    result.state = false
    result.message = SIGNINOUT_MSG_USER_OR_PASSWORD_WRONG
  }

  return JSON.stringify(result)
}

// ออกจากระบบ
function SignOut() {
  let result = Lib_wss.ResultInit(false) // ผลลัพธ์

  // ทำลายเซสชั่น
  if (DestroySession()) { // สำเร็จ
    result.state = true
    result.message = GREETING_MSG_BYE
  }

  return JSON.stringify(result)
}