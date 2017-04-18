// console.log('aabbab'.replace(/a/g, 'c'));
// console.log('<p>123</p>'.replace(/(<\/?\w+>)/g, ''));
// console.log('aabbab'.replace(/a{1,2}/g, 'c'));
// console.log('aaabbaaba'.match(/a*/g));
// console.log('aaabbaaba'.match(/\w{3}/g));
// console.log('/a/a/a/'.match(/a\//g));
var str = '<a></a>a>';
var re = /(?:\/(a)(b+)(c+))/g;
console.log(re.exec(str));