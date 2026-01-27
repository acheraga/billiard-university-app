const fs = require('fs');
const path = require('path');
const levels = ['Bachelors','Masters','Doctorate'];
const skills = ['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10'];

levels.forEach(l=>{
  console.log('\nLevel:', l);
  skills.forEach(s=>{
    const num = s.slice(1).padStart(3,'0');
    const p = path.join(process.cwd(),'public','exam2_images', l, `image-${num}.jpg`);
    console.log(s, '->', `public/exam2_images/${l}/image-${num}.jpg`, fs.existsSync(p));
  });
});
