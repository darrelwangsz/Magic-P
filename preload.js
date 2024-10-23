const fs = require('fs')
const path = require('path')

function removeComments(content, fileExtension) {
  const lines = content.split('\n');
  let inMultiLineComment = false;
  const result = [];

  switch (fileExtension.toLowerCase()) {
    case '.js':
    case '.ts':
    case '.jsx':
    case '.tsx':
    case '.vue':
    case '.java':
    case '.c':
    case '.cpp':
    case '.cs':
      // 处理 C-style 注释的语言
      for (const line of lines) {
        if (!inMultiLineComment) {
          if (line.trim().startsWith('//')) {
            continue; // 跳过单行注释
          }
          if (line.includes('/*') && line.includes('*/')) {
            continue; // 跳过单行的多行注释
          }
          if (line.includes('/*')) {
            inMultiLineComment = true;
            continue;
          }
          result.push(line);
        } else {
          if (line.includes('*/')) {
            inMultiLineComment = false;
          }
        }
      }
      break;
    case '.py':
      // 处理 Python 注释
      for (const line of lines) {
        if (!inMultiLineComment) {
          if (line.trim().startsWith('#')) {
            continue; // 跳过单行注释
          }
          if (line.trim().startsWith('"""') || line.trim().startsWith("'''")) {
            inMultiLineComment = true;
            continue;
          }
          result.push(line);
        } else {
          if (line.includes('"""') || line.includes("'''")) {
            inMultiLineComment = false;
          }
        }
      }
      break;
    case '.html':
    case '.xml':
    case '.svg':
      // 处理 HTML 样式的注释
      for (const line of lines) {
        if (!inMultiLineComment) {
          if (line.includes('<!--')) {
            inMultiLineComment = true;
            continue;
          }
          result.push(line);
        } else {
          if (line.includes('-->')) {
            inMultiLineComment = false;
          }
        }
      }
      break;
    case '.css':
    case '.scss':
    case '.less':
      // 处理 CSS 样式的注释
      for (const line of lines) {
        if (!inMultiLineComment) {
          if (line.includes('/*')) {
            inMultiLineComment = true;
            continue;
          }
          result.push(line);
        } else {
          if (line.includes('*/')) {
            inMultiLineComment = false;
          }
        }
      }
      break;
    default:
      // 如果文件类型未知，不删除任何内容
      return content;
  }

  // 处理多余的换行
  const processedResult = [];
  let emptyLineCount = 0;

  for (const line of result) {
    if (line.trim() === '') {
      emptyLineCount++;
      if (emptyLineCount <= 1) {
        processedResult.push(line);
      }
    } else {
      emptyLineCount = 0;
      processedResult.push(line);
    }
  }

  // 移除开头和结尾的空行
  while (processedResult.length > 0 && processedResult[0].trim() === '') {
    processedResult.shift();
  }
  while (processedResult.length > 0 && processedResult[processedResult.length - 1].trim() === '') {
    processedResult.pop();
  }

  return processedResult.join('\n');
}

window.readFiles = (filePaths) => {
  return filePaths.map(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf-8')
      const fileExtension = path.extname(filePath)
      content = removeComments(content, fileExtension)
      return {
        name: path.basename(filePath),
        content: content
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return {
        name: path.basename(filePath),
        content: `Error reading file: ${error.message}`
      }
    }
  })
}

window.copyToClipboard = (text) => {
  try {
    utools.copyText(text)
    console.log('Text copied to clipboard');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    throw error;
  }
}

console.log('preload.js has been loaded');


// const fs = require('fs')
// const path = require('path')

// window.readFiles = (filePaths) => {
//   return filePaths.map(filePath => {
//     try {
//       const content = fs.readFileSync(filePath, 'utf-8')
//       return {
//         name: path.basename(filePath),
//         content: content
//       }
//     } catch (error) {
//       console.error(`Error reading file ${filePath}:`, error);
//       return {
//         name: path.basename(filePath),
//         content: `Error reading file: ${error.message}`
//       }
//     }
//   })
// }

// window.copyToClipboard = (text) => {
//   try {
//     utools.copyText(text)
//     console.log('Text copied to clipboard');
//   } catch (error) {
//     console.error('Error copying to clipboard:', error);
//     throw error;
//   }
// }

// console.log('preload.js has been loaded');
