import fs from 'fs';

const createLogEvent = () => {
  let numSpaces = 3; // Static variable
  let lastWrite ;

  return (req, description) => {

  // const logEvent = (req, description) => {
    try {  
      // print out session info... whatever is going to identify the user
      let sessionInfo = "";
      let sessionId = "";
      if (!req || !req.session || !req.user || !req.user.id) {
        sessionInfo = 'unknown'
        sessionId = '0';
      } else {
        sessionInfo = `${req.user.id}`.padEnd(7, ' ');
        sessionId = req.session.id;
      }

      description = description + " ";    // just in case there is no space, add one to the end
      const firstPart = description.split(' ')[0];
      const posMatch = firstPart.match(/\d+/);
      const funcMatch = firstPart.match(/^[a-zA-Z]+/);  
      let pos = posMatch ? parseInt(posMatch[0], 10) : 0; // Default to 0 if no match
      let func = funcMatch ? funcMatch[0] : 'unknown';

      //let numSpaces = 3;
      if (pos == 1) {
        numSpaces = numSpaces + 2;
      } 
      const padding = " ".repeat(numSpaces);


      const currentDate = new Date();
      const options = {
          timeZone: 'Australia/Melbourne',
          year: 'numeric',
          month: '2-digit', // 2-digit month
          day: '2-digit',   // 2-digit day
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false // Set to true for 12-hour format
      };

      const formattedDate = currentDate.toLocaleString('en-AU', options);
      const carriageReturn = String.fromCharCode(13);
      const funcPos = `${func}(${pos})`.padEnd(8, ' ');
      const content = formattedDate + ' | ' + sessionInfo + ' | ' + funcPos + padding + " | " + description.padEnd(128, ' ') + " | " + sessionId  + carriageReturn;
      fs.appendFile('security.log', content, (err) => {
        if (err) {
          console.error('lse2   An error occurred while writing to the file:', err);
        } else {
          // console.log('lse3    File has been written successfully');
        }
      });
        
      if (pos == 9 || pos == 8) {
        numSpaces = numSpaces - 2;
      }

    } catch (error) { 
      console.log("lse8     error with logging script!", error)
      return
    }

  };
};




const createLogUser = () => {
  let numSpaces = 3; // Static variable

  return (req, description) => {

  // const logEvent = (req, description) => {
    try {  
      // print out session info... whatever is going to identify the user
      let sessionInfo = "";
      let sessionId = "";
      if (!req || !req.user || !req.user.id) {
        sessionInfo = 'unknown'
        sessionId = '0';
      } else {
        sessionInfo = `${req.user.id}`.padStart(7, '0');
        sessionId = req.session.id;

        const firstPart = description.split(' ')[0];
        const posMatch = firstPart.match(/\d+/);
        const funcMatch = firstPart.match(/^[a-zA-Z]+/);  
        let pos = posMatch ? parseInt(posMatch[0], 10) : 0; // Default to 0 if no match
        let func = funcMatch ? funcMatch[0] : 'unknown';

        //let numSpaces = 3;
        if (pos == 1) {
          numSpaces = numSpaces + 2;
        } 
        const padding = " ".repeat(numSpaces);


        const currentDate = new Date();
        const options = {
            timeZone: 'Australia/Melbourne',
            year: 'numeric',
            month: '2-digit', // 2-digit month
            day: '2-digit',   // 2-digit day
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Set to true for 12-hour format
        };

        const formattedDate = currentDate.toLocaleString('en-AU', options);
        const carriageReturn = String.fromCharCode(13);
        const funcPos = `${func}(${pos})`.padEnd(8, ' ');
        const content = formattedDate + ' | ' + sessionInfo + ' | ' + funcPos + padding + " | " + description.padEnd(128, ' ')  + " | " + sessionId  + carriageReturn; 
        console.log('clu5    ', sessionInfo );
        fs.appendFile(sessionInfo + '.log', content, (err) => {
          if (err) {
            console.error('lse2   An error occurred while writing to the file:', err);
          } else {
            // console.log('lse3    File has been written successfully');
          }
        });
          
        if (pos == 9 || pos == 8) {
          numSpaces = numSpaces - 2;
        }
      }

    } catch (error) { 
      console.log("lse8     error with logging script!", error)
      return
    }

  };
};




const logEvent = createLogEvent();
const logUser = createLogUser();

  
  export {logUser, logEvent};
  