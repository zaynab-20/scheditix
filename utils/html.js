exports.verify = (link, firstName) => {
    return `
    <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Email Verification</title>
    <style>
      body, html {
        margin: 0;
        padding: 0;
        background-color: #ffffff;
        color: #1e1e1e;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        width: 100%;
        height: 100%;
      }
  
      .container {
        width: 100%;
        padding: 40px 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }
  
      .email-body {
        width: 100%;
        max-width: 500px;
        background-color: #ffffff;
        border-radius: 16px;
        padding: 32px 24px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        text-align: center;
      }
  
      .email-header {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 16px;
      }
  
      .email-text {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 16px;
      }
  
      .highlight {
        color: #ff5722;
        font-weight: 600;
      }
  
      .email-button {
        display: inline-block;
        background-color: #ff5722;
        color: #ffffff;
        text-decoration: none;
        padding: 14px 24px;
        font-size: 16px;
        border-radius: 10px;
        margin-top: 20px;
        font-weight: bold;
      }
  
      @media (prefers-color-scheme: dark) {
        body, html {
          background-color: #121212;
          color: #ffffff;
        }
  
        .email-body {
          background-color: #1e1e1e;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(255,255,255,0.05);
        }
      }
  
      @media screen and (max-width: 480px) {
        .email-body {
          padding: 24px 16px;
        }
  
        .email-header {
          font-size: 20px;
        }
  
        .email-text {
          font-size: 15px;
        }
  
        .email-button {
          font-size: 14px;
          padding: 12px 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="email-body">
        <h2 class="email-header">Welcome to ShediTix!</h2>
        <p class="email-text">
          Congratulations <strong>${firstName}</strong>! You’re officially part of the SchediTix family! 🙌 We’re so
          excited to help you create, manage, and promote amazing events.
        </p>
        <p class="email-text">
          Before you dive in, we just need you to <span class="highlight">verify your email</span> to activate your account.
          It’s super quick—just click the button below and you’re good to go! 🥰
        </p>
        <a href="${link}" class="email-button">Verify email address</a>
      </div>
    </div>
  </body>
  </html>
    `;
  }
  
  

exports.reset = (link, firstName) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #2c2c2c; /* Dark background */
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 80%;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    background-color: #f4f4f4; /* Light grey background */
                }
                .header {
                    background: #333333;
                    padding: 20px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                    color: #ffffff;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .button-container {
                    text-align: center;
                    margin: 20px 0;
                }
                .button {
                    display: inline-block;
                    background-color: #28a745; /* Green background */
                    color: #ffffff;
                    padding: 15px 30px;
                    font-size: 18px;
                    text-decoration: none;
                    border-radius: 5px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #218838;
                }
                .footer {
                    background: #333333;
                    padding: 10px;
                    text-align: center;
                    border-top: 1px solid #ddd;
                    font-size: 0.9em;
                    color: #cccccc;
                    border-radius: 0 0 10px 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset</h1>
                </div>
                <div class="content">
                    <p>Hello ${firstName},</p>
                    <p>Here is a link to reset your password.</p>
                    <p>Please click the button below to reset your password:</p>
                    <div class="button-container">
                        <a href="${link}" class="button">Reset My Password</a>
                    </div>
                    <p>If you did not request for password reset, kindly ignore this email.</p>
                    <p>Best regards.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} . All rights reserved.</p>
                </div>  
            </div>
        </body>
        </html>
        

  `
}

exports.successfulPaymentTemplate = ({
  firstName, 
  checkInCode, 
  tableNumber, 
  seatNumber, 
  specialRequest, 
  carAccess
}) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Successful</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
          color: #1e1e1e;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          width: 100%;
          height: 100%;
        }
        .container {
          width: 100%;
          padding: 40px 20px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .email-body {
          width: 100%;
          max-width: 500px;
          background-color: #ffffff;
          border-radius: 16px;
          padding: 32px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          text-align: center;
        }
        .email-header {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 16px;
          color: blue;
        }
        .email-text {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .highlight {
          color: #ff5722;
          font-weight: 600;
        }
        .email-info-box {
          background-color: #f9f9f9;
          padding: 16px;
          border-radius: 10px;
          margin-top: 20px;
          text-align: left;
          font-size: 15px;
          line-height: 1.5;
        }
        .email-info-box strong {
          color: #ff5722;
        }
        @media (prefers-color-scheme: dark) {
          body, html {
            background-color: #121212;
            color: #ffffff;
          }
          .email-body {
            background-color: #1e1e1e;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-body">
          <h2 class="email-header">Payment Successful</h2>
          <p class="email-text">
            Congratulations <strong>${firstName}</strong>! Your payment was
            successful 🙌 We're excited to welcome you to the event.
          </p>
          <div class="email-info-box">
            <p><strong>Check-in Code:</strong> ${checkInCode}</p>
            <p><strong>Seat:</strong> Table ${tableNumber}, Seat ${seatNumber}</p>
            <p><strong>Car Access:</strong> ${carAccess ? 'Yes' : 'No'}</p>
            <p><strong>Special Request:</strong> ${specialRequest || 'None'}</p>
          </div>
          <p class="email-text">
            Please keep this information safe. You'll need it to enter the event
            and get seated. 🪪
          </p>
        </div>
      </div>
    </body>
  </html>
  `;
};

exports.failedPaymentTemplate = (firstName) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Payment Failed</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
          color: #1e1e1e;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          width: 100%;
          height: 100%;
        }
        .container {
          width: 100%;
          padding: 40px 20px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .email-body {
          width: 100%;
          max-width: 500px;
          background-color: #ffffff;
          border-radius: 16px;
          padding: 32px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          text-align: center;
        }
        .email-header {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 16px;
          color: red;
        }
        .email-text {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .highlight {
          color: #ff5722;
          font-weight: 600;
        }
        @media (prefers-color-scheme: dark) {
          body, html {
            background-color: #121212;
            color: #ffffff;
          }
          .email-body {
            background-color: #1e1e1e;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-body">
          <h2 class="email-header">Payment Failed</h2>
          <p class="email-text">
            Hello <strong>${firstName}</strong>, unfortunately, your payment
            attempt was unsuccessful.
          </p>
          <p class="email-text">
            Please try again or reach out to support if the issue persists.
          </p>
          <p class="email-text">We hope to see you at the event soon!</p>
        </div>
      </div>
    </body>
  </html>
  `;
};



// exports.Successful = (firstName, checkInCode, tableNumber, seatNumber,
//   specialRequest, carAccess) => { return `
//   <!DOCTYPE html>
//   <html lang="en">
//     <head>
//       <meta charset="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <title>Payment Successful</title>
//       <style>
//         body,
//         html {
//           margin: 0;
//           padding: 0;
//           background-color: #ffffff;
//           color: #1e1e1e;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
//             Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
//           width: 100%;
//           height: 100%;
//         }
//         .container {
//           width: 100%;
//           padding: 40px 20px;
//           box-sizing: border-box;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//         }
//         .email-body {
//           width: 100%;
//           max-width: 500px;
//           background-color: #ffffff;
//           border-radius: 16px;
//           padding: 32px 24px;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
//           text-align: center;
//         }
//         .email-header {
//           font-size: 24px;
//           font-weight: bold;
//           margin-bottom: 16px;
//           color: blue;
//         }
//         .email-text {
//           font-size: 16px;
//           line-height: 1.6;
//           margin-bottom: 16px;
//         }
//         .highlight {
//           color: #ff5722;
//           font-weight: 600;
//         }
//         .email-info-box {
//           background-color: #f9f9f9;
//           padding: 16px;
//           border-radius: 10px;
//           margin-top: 20px;
//           text-align: left;
//           font-size: 15px;
//           line-height: 1.5;
//         }
//         .email-info-box strong {
//           color: #ff5722;
//         }
//         @media (prefers-color-scheme: dark) {
//           body,
//           html {
//             background-color: #121212;
//             color: #ffffff;
//           }
//           .email-body {
//             background-color: #1e1e1e;
//             color: #ffffff;
//             box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
//           }
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="email-body">
//           <h2 class="email-header">Payment Successful</h2>
//           <p class="email-text">
//             Congratulations <strong>${firstName}</strong>! Your payment was
//             successful 🙌 We're excited to welcome you to the event.
//           </p>
//           <div class="email-info-box">
//             <p><strong>Check-in Code:</strong> ${checkInCode}</p>
//             <p><strong>Seat:</strong> Table ${tableNumber}, Seat ${seatNumber}</p>
//             <p><strong>Car Access:</strong> ${carAccess ? 'Yes' : 'No'}</p>
//             <p><strong>Special Request:</strong> ${specialRequest || 'None'}</p>
//           </div>
//           <p class="email-text">
//             Please keep this information safe. You'll need it to enter the event
//             and get seated. 🪪
//           </p>
//         </div>
//       </div>
//     </body>
//   </html>
//   ` }


//   exports.Failed = (firstName) => { return `
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>Payment Failed</title>
//         <style>
//           body,
//           html {
//             margin: 0;
//             padding: 0;
//             background-color: #ffffff;
//             color: #1e1e1e;
//             font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
//               Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
//             width: 100%;
//             height: 100%;
//           }
//           .container {
//             width: 100%;
//             padding: 40px 20px;
//             box-sizing: border-box;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//           }
//           .email-body {
//             width: 100%;
//             max-width: 500px;
//             background-color: #ffffff;
//             border-radius: 16px;
//             padding: 32px 24px;
//             box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
//             text-align: center;
//           }
//           .email-header {
//             font-size: 24px;
//             font-weight: bold;
//             margin-bottom: 16px;
//             color: red;
//           }
//           .email-text {
//             font-size: 16px;
//             line-height: 1.6;
//             margin-bottom: 16px;
//           }
//           .highlight {
//             color: #ff5722;
//             font-weight: 600;
//           }
//           @media (prefers-color-scheme: dark) {
//             body,
//             html {
//               background-color: #121212;
//               color: #ffffff;
//             }
//             .email-body {
//               background-color: #1e1e1e;
//               color: #ffffff;
//               box-shadow: 0 4px 12px rgba(255, 255, 255, 0.05);
//             }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="email-body">
//             <h2 class="email-header">Payment Failed</h2>
//             <p class="email-text">
//               Hello <strong>${firstName}</strong>, unfortunately, your payment
//               attempt was unsuccessful.
//             </p>
//             <p class="email-text">
//               Please try again or reach out to support if the issue persists.
//             </p>
//             <p class="email-text">We hope to see you at the event soon!</p>
//           </div>
//         </div>
//       </body>
//     </html>
//     `}