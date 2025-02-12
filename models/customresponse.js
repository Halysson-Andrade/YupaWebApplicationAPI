 class CustomResponse {
     timeSentFromClient = 0;
     timeReceivedFromBack = 0;
     timeSentFromBack = 0;
     data;
     errorCount = 0;
     errors = [];
     httpStatus = 0;
 }

 module.exports = CustomResponse