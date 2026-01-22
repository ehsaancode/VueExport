const readWriteFile = require('../../utility/read_write_file');

async function parseAnimation(startingColum, fileName, jsonObjects, componentId) {
     if(jsonObjects.length > 0) {
          for (const index in jsonObjects) {
               var jsonObj = jsonObjects[index];
               var annotationType = jsonObj["animationType"] ?? ""
               await parseAnimationWithType(startingColum, fileName, annotationType, componentId, jsonObj)
               await parseAnimationBlock(startingColum, fileName, annotationType, componentId, jsonObj);
          }
          await parseAnimationOverlay(startingColum, fileName, jsonObjects, componentId);
     }
     
}

async function parseAnimationWithType(startingColum, fileName, annotationType, componentId, jsonObject) {
     try {
          let animationId = `${componentId}_${annotationType}`;
          switch (annotationType) {
               case 'fade':
                    await parseAnimationFade(startingColum, fileName, animationId, jsonObject);
                    break;
               case 'slide':
                    await parseAnimationSlide(startingColum, fileName, animationId, jsonObject);
                    break;
               case 'shake':
                    await parseAnimationShake(startingColum, fileName, animationId, jsonObject);
                    break;
               case 'blur':
                    await parseAnimationBlur(startingColum, fileName, animationId, jsonObject);
                    break;
               case 'rotate':
                    await parseAnimationRotate(startingColum, fileName, animationId, jsonObject);
                    break;
               case 'scale':
                    await parseAnimationScale(startingColum, fileName, animationId, jsonObject);
                    break;
               case 'bounce':
                    await parseAnimationBounce(startingColum, fileName, animationId, jsonObject);
                    break;
               case 'flip':
                    await parseAnimationFlip(startingColum, fileName, animationId, jsonObject);
                    break;
               case 'skew':
                    await parseAnimationSkew(startingColum, fileName, animationId, jsonObject);
                    break;
               default:
          }
     } catch (err) {
      
     }
}

async function parseAnimationFade(startingColum, fileName, animationId, jsonObject) {
     let animationDirection = jsonObject["animationDirection"];
     switch (animationDirection) {
          case 'left':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum) + `.offset(x: animatedComponentsIds.contains(\"${animationId}\") ? 0 : -UIScreen.main.bounds.width) \n`
               );
               break;
          case 'right':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum) + `.offset(x: animatedComponentsIds.contains(\"${animationId}\") ? 0 : UIScreen.main.bounds.width) \n`
               );
               break;
          case 'top':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum) + `.offset(y: animatedComponentsIds.contains(\"${animationId}\") ? 0 : -UIScreen.main.bounds.height) \n`
               );
               break;
          case 'bottom':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum) + `.offset(y: animatedComponentsIds.contains(\"${animationId}\") ? 0 : UIScreen.main.bounds.height) \n`
               );
               break;
          default:
     }
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `.opacity(animatedComponentsIds.contains(\"${animationId}\") ? 1.0 : 0.0) \n`
     );
}

async function parseAnimationSlide(startingColum, fileName, animationId, jsonObject) {
     let animationDirection = jsonObject["animationDirection"];
     switch (animationDirection) {
          case 'left':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum) + `.offset(x: animatedComponentsIds.contains(\"${animationId}\") ? 0 : -UIScreen.main.bounds.width) \n`
               );
               break;
          case 'right':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum) + `.offset(x: animatedComponentsIds.contains(\"${animationId}\") ? 0 : UIScreen.main.bounds.width) \n`
               );
               break;
          case 'top':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum) + `.offset(y: animatedComponentsIds.contains(\"${animationId}\") ? 0 : -UIScreen.main.bounds.height) \n`
               );
               break;
          case 'bottom':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum) + `.offset(y: animatedComponentsIds.contains(\"${animationId}\") ? 0 : UIScreen.main.bounds.height) \n`
               );
               break;
          default:
     }
}

async function parseAnimationShake(startingColum, fileName, animationId, jsonObject) {
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `.offset(x: animatedComponentsIds.contains(\"${animationId}\") ? -10 : 10) \n`
     );
}

async function parseAnimationBlur(startingColum, fileName, animationId, jsonObject) {
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `.blur(radius: animatedComponentsIds.contains(\"${animationId}\") ? 0 : 10) \n`
     );
}

async function parseAnimationRotate(startingColum, fileName, animationId, jsonObject) {
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `.rotation3DEffect( \n` +
          ' '.repeat(startingColum + 2) + `Angle(degrees: animatedComponentsIds.contains(\"${animationId}\") ? 360 : 0), \n` +
          ' '.repeat(startingColum + 2) + `axis: (x: 0, y: 0, z: 1) \n` +
          ' '.repeat(startingColum) + `) \n`
     );
}

async function parseAnimationScale(startingColum, fileName, animationId, jsonObject) {
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `.scaleEffect(animatedComponentsIds.contains(\"${animationId}\") ? 1 : 1.5) \n`
     );
}

async function parseAnimationBounce(startingColum, fileName, animationId, jsonObject) {
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `.offset(y: animatedComponentsIds.contains(\"${animationId}\") ? 0 : -50) \n`
     );
}

async function parseAnimationFlip(startingColum, fileName, animationId, jsonObject) {
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `.rotation3DEffect( \n`
     );
     switch (animationDirection) {
          case 'left':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum + 2) + `Angle(degrees: animatedComponentsIds.contains(\"${animationId}\") ? -180 : 0), \n` +
                    ' '.repeat(startingColum + 2) + `axis: (x: 0, y: 1, z: 0) \n`
               );
               break;
          case 'right':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum + 2) + `Angle(degrees: animatedComponentsIds.contains(\"${animationId}\") ? 180 : 0), \n` +
                    ' '.repeat(startingColum + 2) + `axis: (x: 0, y: 1, z: 0) \n`
               );
               break;
          case 'top':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum + 2) + `Angle(degrees: animatedComponentsIds.contains(\"${animationId}\") ? -180 : 0), \n` +
                    ' '.repeat(startingColum + 2) + `axis: (x: 1, y: 0, z: 0) \n`
               );
               break;
          case 'bottom':
               await readWriteFile.writeToFile(fileName,
                    ' '.repeat(startingColum + 2) + `Angle(degrees: animatedComponentsIds.contains(\"${animationId}\") ? 180 : 0), \n` +
                    ' '.repeat(startingColum + 2) + `axis: (x: 1, y: 0, z: 0) \n`
               );
               break;
          default:
     }
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `) \n`
     );
}

async function parseAnimationSkew(startingColum, fileName, animationId, jsonObject) {
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `.offset(y: animatedComponentsIds.contains(\"${animationId}\") ? 0 : -50) \n`
     );
}

async function parseAnimationBlock(startingColum, fileName, annotationType, componentId, jsonObject) {
     let animationId = `${componentId}_${annotationType}`;
     let animationDuration = parseInt(jsonObject["animationDuration"]);
     let animationIterations = parseInt(jsonObject["animationIterations"] ?? "0") ?? 0;
     let isRevarsed = jsonObject["isRevarsed"] ?? "false";
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `.animation( \n` 
     );
     if(annotationType === "bounce") {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum + 2) + `Animation.spring(response: 0.5, dampingFraction: 0.6, blendDuration: 0) \n`
          );
     } else {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum + 2) + `Animation.linear(duration: ${animationDuration}) \n`
          );
     }
     if(animationIterations > 0) {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum + 4) + `.repeatCount(${animationIterations}, autoreverses: ${isRevarsed == "true" ? true : false}), \n`
          );
     } else {
          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum + 4) + `.repeatForever(autoreverses: ${isRevarsed == "true" ? true : false}), \n`
          );
     }
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum + 2) + `value: animatedComponentsIds.contains(\"${animationId}\") \n` +
          ' '.repeat(startingColum) + `) \n`
     );
}

async function parseAnimationOverlay(startingColum, fileName, jsonObjects, componentId) {
     let animationDelay = 0 
     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum) + `.overlay ( \n` +
          ' '.repeat(startingColum + 2) + `VisibilityDetector(id: ${componentId}) { id in \n`
     );

     for (const index in jsonObjects) {
          let jsonObj = jsonObjects[index];
          animationDelay = animationDelay + parseInt(jsonObj["animationDelay"]);
          let animationDuration = parseInt(jsonObj["animationDuration"]);
          let annotationType = jsonObj["animationType"] ?? ""
          let animationId = `${componentId}_${annotationType}`;

          await readWriteFile.writeToFile(fileName,
               ' '.repeat(startingColum + 4) + `if(!animatedComponentsIds.contains(\"${animationId}\")) { \n` +
               ' '.repeat(startingColum + 6) + `DispatchQueue.main.asyncAfter(deadline: .now() + ${animationDelay}) { \n` +
               // ' '.repeat(startingColum + 8) + `withAnimation(.easeInOut(duration: ${animationDuration})) { \n` +
               ' '.repeat(startingColum + 10) + `animatedComponentsIds.append("${animationId}") \n` +
               // ' '.repeat(startingColum + 8) + `} \n` +
               ' '.repeat(startingColum + 6) + `} \n` +
               ' '.repeat(startingColum + 4) + `} \n`
          );
          animationDelay = animationDelay + animationDuration;
     }

     await readWriteFile.writeToFile(fileName,
          ' '.repeat(startingColum + 2) + `} \n` +
          ' '.repeat(startingColum) + `) \n`
     );

}

module.exports = {
     parseAnimation
}