/**
 * @typedef {Object} PortfolioStat
 * @property {string} value - Ð§Ð¸ÑÐ»Ð¾Ð²Ð¾Ðµ Ð·Ð½Ð°ÑÐµÐ½Ð¸Ðµ (Ð½Ð°Ð¿ÑÐ¸Ð¼ÐµÑ "150%", "10K+")
 * @property {string} labelKey - ÐÐ»ÑÑ Ð¿ÐµÑÐµÐ²Ð¾Ð´Ð° Ð´Ð»Ñ Ð¿Ð¾Ð´Ð¿Ð¸ÑÐ¸ (data-translate)
 */

/**
 * @typedef {Object} PortfolioProject
 * @property {string} id - Ð£Ð½Ð¸ÐºÐ°Ð»ÑÐ½ÑÐ¹ Ð¸Ð´ÐµÐ½ÑÐ¸ÑÐ¸ÐºÐ°ÑÐ¾Ñ
 * @property {string} image - URL Ð¸Ð·Ð¾Ð±ÑÐ°Ð¶ÐµÐ½Ð¸Ñ
 * @property {string} imageAlt - ÐÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð¸Ð·Ð¾Ð±ÑÐ°Ð¶ÐµÐ½Ð¸Ñ Ð´Ð»Ñ Ð´Ð¾ÑÑÑÐ¿Ð½Ð¾ÑÑÐ¸
 * @property {string} badge - Ð¢ÐµÐºÑÑ Ð±ÐµÐ¹Ð´Ð¶Ð° (Featured, Banking Ð¸ Ñ.Ð´.)
 * @property {string} categoryKey - ÐÐ»ÑÑ Ð¿ÐµÑÐµÐ²Ð¾Ð´Ð° ÐºÐ°ÑÐµÐ³Ð¾ÑÐ¸Ð¸ (cat_ecommerce, cat_fintech...)
 * @property {string} titleKey - ÐÐ»ÑÑ Ð¿ÐµÑÐµÐ²Ð¾Ð´Ð° Ð·Ð°Ð³Ð¾Ð»Ð¾Ð²ÐºÐ° (project1_title...)
 * @property {string[]} tags - Ð¢ÐµÐ³Ð¸ ÑÐµÑÐ½Ð¾Ð»Ð¾Ð³Ð¸Ð¹ (React, Node.js...)
 * @property {string} descKey - ÐÐ»ÑÑ Ð¿ÐµÑÐµÐ²Ð¾Ð´Ð° Ð¾Ð¿Ð¸ÑÐ°Ð½Ð¸Ñ (project1_desc...)
 * @property {PortfolioStat[]} stats - ÐÐ°ÑÑÐ¸Ð² ÑÑÐ°ÑÐ¸ÑÑÐ¸ÐºÐ¸
 * @property {string} link - Ð¡ÑÑÐ»ÐºÐ° Ð½Ð° ÐºÐµÐ¹Ñ (# Ð¸Ð»Ð¸ URL)
 * @property {string} year - ÐÐ¾Ð´ (2024, 2025)
 */

// âââ Inline SVG Ð¸Ð»Ð»ÑÑÑÑÐ°ÑÐ¸Ð¸ Ð´Ð»Ñ ÐºÐ°Ð¶Ð´Ð¾Ð³Ð¾ Ð¿ÑÐ¾ÐµÐºÑÐ° âââââââââââââââââ
const IMG = {
  // E-commerce: Ð¼Ð°Ð³Ð°Ð·Ð¸Ð½ Ñ ÐºÐ¾ÑÐ·Ð¸Ð½Ð¾Ð¹, ÑÐµÐ½Ð½Ð¸ÐºÐ°Ð¼Ð¸ Ð¸ Ð³ÑÐ°ÑÐ¸ÐºÐ¾Ð¼ ÑÐ¾ÑÑÐ°
  ecommerce: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'><defs><linearGradient id='bg-ec' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23111827'/><stop offset='100%' stop-color='%230f172a'/></linearGradient><linearGradient id='acc' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%238b5cf6'/></linearGradient></defs><rect width='800' height='400' fill='url(%23bg-ec)'/><rect x='60' y='60' width='220' height='280' rx='16' fill='%231e293b' stroke='%236366f1' stroke-width='1.5'/><rect x='80' y='80' width='180' height='100' rx='10' fill='%23374151'/><circle cx='130' cy='130' r='25' fill='%236366f1' opacity='.6'/><rect x='170' y='110' width='75' height='12' rx='6' fill='%234b5563'/><rect x='170' y='130' width='50' height='10' rx='5' fill='%236366f1'/><rect x='80' y='200' width='180' height='12' rx='6' fill='%234b5563'/><rect x='80' y='222' width='120' height='12' rx='6' fill='%234b5563'/><rect x='80' y='260' width='60' height='36' rx='8' fill='url(%23acc)'/><rect x='160' y='260' width='60' height='36' rx='8' fill='%23374151' stroke='%236366f1' stroke-width='1'/><rect x='320' y='40' width='180' height='100' rx='12' fill='%231e293b' stroke='%238b5cf6' stroke-width='1'/><text x='410' y='75' text-anchor='middle' fill='%238b5cf6' font-size='18' font-weight='600' font-family='sans-serif'>SALE</text><text x='410' y='100' text-anchor='middle' fill='%23ec4899' font-size='28' font-weight='700' font-family='sans-serif'>-40%</text><rect x='320' y='160' width='180' height='100' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><circle cx='370' cy='210' r='22' fill='%236366f1' opacity='.5'/><rect x='405' y='198' width='80' height='10' rx='5' fill='%234b5563'/><rect x='405' y='214' width='55' height='10' rx='5' fill='%236366f1'/><rect x='320' y='280' width='180' height='100' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><rect x='340' y='300' width='140' height='60' rx='6' fill='%23374151'/><polyline points='355,345 380,320 405,335 430,305 455,325 465,310' fill='none' stroke='%234ade80' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/><circle cx='465' cy='310' r='3' fill='%234ade80'/><rect x='540' y='60' width='200' height='140' rx='14' fill='%231e293b' stroke='%236366f1' stroke-width='1.5'/><text x='640' y='95' text-anchor='middle' fill='%23cbd5e1' font-size='13' font-family='sans-serif'>ÐÐ°ÐºÐ°Ð·Ñ</text><rect x='570' y='110' width='30' height='70' rx='4' fill='%236366f1' opacity='.4'/><rect x='610' y='90' width='30' height='90' rx='4' fill='%236366f1' opacity='.6'/><rect x='650' y='70' width='30' height='110' rx='4' fill='%236366f1'/><rect x='690' y='85' width='30' height='95' rx='4' fill='%238b5cf6' opacity='.7'/><rect x='540' y='220' width='200' height='160' rx='14' fill='%231e293b' stroke='%238b5cf6' stroke-width='1'/><text x='640' y='250' text-anchor='middle' fill='%23cbd5e1' font-size='13' font-family='sans-serif'>ÐÑÑÑÑÐºÐ°</text><polyline points='565,360 595,340 625,350 655,310 685,320 715,290' fill='none' stroke='%23ec4899' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/><circle cx='715' cy='290' r='4' fill='%23ec4899'/><rect x='565' y='260' width='150' height='2' fill='%23374151'/><rect x='565' y='280' width='150' height='2' fill='%23374151'/><rect x='565' y='300' width='150' height='2' fill='%23374151'/><rect x='565' y='320' width='150' height='2' fill='%23374151'/><rect x='565' y='340' width='150' height='2' fill='%23374151'/>`,

  // Fintech: ÑÐ¼Ð°ÑÑÑÐ¾Ð½ Ñ Ð±Ð°Ð½ÐºÐ¾Ð²ÑÐºÐ¸Ð¼ Ð¸Ð½ÑÐµÑÑÐµÐ¹ÑÐ¾Ð¼
  fintech: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'><defs><linearGradient id='bg-ft' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23111827'/><stop offset='100%' stop-color='%230f172a'/></linearGradient><linearGradient id='card' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%238b5cf6'/></linearGradient><linearGradient id='card2' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23ec4899'/><stop offset='100%' stop-color='%238b5cf6'/></linearGradient></defs><rect width='800' height='400' fill='url(%23bg-ft)'/><rect x='240' y='20' width='180' height='360' rx='24' fill='%231e293b' stroke='%236366f1' stroke-width='2'/><rect x='255' y='40' width='150' height='320' rx='12' fill='%23111827'/><rect x='270' y='55' width='120' height='70' rx='10' fill='url(%23card)'/><text x='330' y='82' text-anchor='middle' fill='white' font-size='11' font-family='sans-serif' opacity='.8'>Balance</text><text x='330' y='108' text-anchor='middle' fill='white' font-size='22' font-weight='700' font-family='sans-serif'>%2448 200</text><rect x='275' y='140' width='30' height='30' rx='15' fill='%236366f1' opacity='.3'/><circle cx='290' cy='155' r='8' fill='%236366f1'/><rect x='312' y='145' width='50' height='8' rx='4' fill='%23374151'/><rect x='312' y='158' width='35' height='7' rx='3' fill='%234b5563'/><rect x='275' y='180' width='30' height='30' rx='15' fill='%238b5cf6' opacity='.3'/><circle cx='290' cy='195' r='8' fill='%238b5cf6'/><rect x='312' y='185' width='50' height='8' rx='4' fill='%23374151'/><rect x='312' y='198' width='40' height='7' rx='3' fill='%234b5563'/><rect x='275' y='220' width='30' height='30' rx='15' fill='%23ec4899' opacity='.3'/><circle cx='290' cy='235' r='8' fill='%23ec4899'/><rect x='312' y='225' width='45' height='8' rx='4' fill='%23374151'/><rect x='312' y='238' width='30' height='7' rx='3' fill='%234b5563'/><rect x='275' y='275' width='110' height='40' rx='10' fill='%236366f1'/><text x='330' y='301' text-anchor='middle' fill='white' font-size='13' font-weight='600' font-family='sans-serif'>Send Money</text><rect x='50' y='80' width='160' height='100' rx='12' fill='url(%23card)'/><rect x='50' y='80' width='160' height='40' rx='12' fill='none' stroke='%23ffffff' stroke-opacity='.1'/><text x='130' y='108' text-anchor='middle' fill='white' font-size='11' font-family='sans-serif' opacity='.7'>VISA</text><text x='130' y='140' text-anchor='middle' fill='white' font-size='14' font-weight='600' font-family='sans-serif'>â¢â¢â¢â¢ 4829</text><text x='130' y='162' text-anchor='middle' fill='white' font-size='10' font-family='sans-serif' opacity='.7'>07 / 28</text><rect x='50' y='200' width='160' height='100' rx='12' fill='url(%23card2)'/><text x='130' y='228' text-anchor='middle' fill='white' font-size='11' font-family='sans-serif' opacity='.7'>MASTER</text><text x='130' y='260' text-anchor='middle' fill='white' font-size='14' font-weight='600' font-family='sans-serif'>â¢â¢â¢â¢ 7154</text><text x='130' y='282' text-anchor='middle' fill='white' font-size='10' font-family='sans-serif' opacity='.7'>12 / 26</text><rect x='540' y='60' width='180' height='160' rx='14' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='630' y='90' text-anchor='middle' fill='%23cbd5e1' font-size='13' font-family='sans-serif'>Ð¢ÑÐ°Ð½Ð·Ð°ÐºÑÐ¸Ð¸</text><rect x='560' y='105' width='140' height='1' fill='%23374151'/><circle cx='575' cy='125' r='6' fill='%234ade80'/><rect x='590' y='121' width='60' height='8' rx='4' fill='%234b5563'/><rect x='660' y='121' width='35' height='8' rx='4' fill='%234ade80' text-anchor='end'/><circle cx='575' cy='150' r='6' fill='%23ec4899'/><rect x='590' y='146' width='55' height='8' rx='4' fill='%234b5563'/><rect x='665' y='146' width='30' height='8' rx='4' fill='%23ec4899'/><circle cx='575' cy='175' r='6' fill='%234ade80'/><rect x='590' y='171' width='65' height='8' rx='4' fill='%234b5563'/><rect x='658' y='171' width='37' height='8' rx='4' fill='%234ade80'/><rect x='540' y='240' width='180' height='130' rx='14' fill='%231e293b' stroke='%238b5cf6' stroke-width='1'/><text x='630' y='270' text-anchor='middle' fill='%23cbd5e1' font-size='13' font-family='sans-serif'>ÐÐ½Ð°Ð»Ð¸ÑÐ¸ÐºÐ°</text><circle cx='630' cy='315' r='45' fill='none' stroke='%236366f1' stroke-width='10' stroke-dasharray='188 283' stroke-linecap='round'/><circle cx='630' cy='315' r='45' fill='none' stroke='%238b5cf6' stroke-width='10' stroke-dasharray='60 188' stroke-dashoffset='-188' stroke-linecap='round'/><circle cx='630' cy='315' r='45' fill='none' stroke='%23ec4899' stroke-width='10' stroke-dasharray='35 223' stroke-dashoffset='-248' stroke-linecap='round'/><circle cx='630' cy='315' r='18' fill='%230f172a'/><text x='630' y='320' text-anchor='middle' fill='white' font-size='11' font-weight='700' font-family='sans-serif'>68%</text><rect x='50' y='320' width='160' height='60' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='80' y='348' fill='%23cbd5e1' font-size='12' font-family='sans-serif'>QR Pay</text><rect x='160' y='333' width='38' height='38' rx='6' fill='%236366f1' opacity='.4'/><rect x='167' y='340' width='6' height='6' fill='%236366f1'/><rect x='179' y='340' width='6' height='6' fill='%236366f1'/><rect x='167' y='352' width='6' height='6' fill='%236366f1'/><rect x='179' y='352' width='6' height='6' fill='%236366f1'/>`,

  // CRM: Ð´Ð°ÑÐ±Ð¾ÑÐ´ Ñ Ð²Ð¾ÑÐ¾Ð½ÐºÐ¾Ð¹ Ð¸ Ð³ÑÐ°ÑÐ¸ÐºÐ°Ð¼Ð¸
  crm: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'><defs><linearGradient id='bg-crm' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23111827'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='800' height='400' fill='url(%23bg-crm)'/><rect x='30' y='30' width='230' height='155' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='55' y='55' fill='%23cbd5e1' font-size='13' font-weight='600' font-family='sans-serif'>ÐÐ¾ÑÐ¾Ð½ÐºÐ° Ð¿ÑÐ¾Ð´Ð°Ð¶</text><rect x='75' y='75' width='190' height='28' rx='6' fill='%236366f1'/><text x='170' y='94' text-anchor='middle' fill='white' font-size='11' font-family='sans-serif'>ÐÐ¸Ð´Ñ â 2400</text><rect x='95' y='113' width='150' height='24' rx='6' fill='%238b5cf6'/><text x='170' y='130' text-anchor='middle' fill='white' font-size='11' font-family='sans-serif'>ÐÐ²Ð¾Ð½ÐºÐ¸ â 960</text><rect x='115' y='147' width='110' height='22' rx='6' fill='%23a78bfa'/><text x='170' y='163' text-anchor='middle' fill='white' font-size='10' font-family='sans-serif'>Ð¡Ð´ÐµÐ»ÐºÐ¸ â 384</text><rect x='140' y='179' width='60' height='16' rx='5' fill='%23ec4899'/><text x='170' y='190' text-anchor='middle' fill='white' font-size='9' font-family='sans-serif'>ÐÑÐ¾Ð´Ð°Ð¶Ð°</text><rect x='280' y='30' width='220' height='155' rx='12' fill='%231e293b' stroke='%238b5cf6' stroke-width='1'/><text x='305' y='55' fill='%23cbd5e1' font-size='13' font-weight='600' font-family='sans-serif'>ÐÑÑÑÑÐºÐ°</text><polyline points='310,160 340,145 370,135 400,100 430,85 460,70 490,55' fill='none' stroke='%234ade80' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/><polygon points='310,160 340,145 370,135 400,100 430,85 460,70 490,55 490,165 310,165' fill='%234ade80' opacity='.08'/><circle cx='490' cy='55' r='4' fill='%234ade80'/><text x='490' y='48' text-anchor='middle' fill='%234ade80' font-size='10' font-weight='600' font-family='sans-serif'>+200%</text><rect x='310' y='75' width='180' height='1' fill='%23374151'/><rect x='310' y='95' width='180' height='1' fill='%23374151'/><rect x='310' y='115' width='180' height='1' fill='%23374151'/><rect x='310' y='135' width='180' height='1' fill='%23374151'/><rect x='530' y='30' width='240' height='155' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='555' y='55' fill='%23cbd5e1' font-size='13' font-weight='600' font-family='sans-serif'>ÐÐ»Ð¸ÐµÐ½ÑÑ</text><circle cx='590' cy='115' r='40' fill='none' stroke='%236366f1' stroke-width='9' stroke-dasharray='126 126' stroke-linecap='round'/><circle cx='590' cy='115' r='40' fill='none' stroke='%238b5cf6' stroke-width='9' stroke-dasharray='100 152' stroke-dashoffset='-126' stroke-linecap='round'/><circle cx='590' cy='115' r='40' fill='none' stroke='%23ec4899' stroke-width='9' stroke-dasharray='26 226' stroke-dashoffset='-226' stroke-linecap='round'/><circle cx='590' cy='115' r='20' fill='%230f172a'/><text x='590' y='120' text-anchor='middle' fill='white' font-size='13' font-weight='700' font-family='sans-serif'>500+</text><rect x='650' y='80' width='8' height='8' rx='2' fill='%236366f1'/><text x='663' y='88' fill='%23cbd5e1' font-size='9' font-family='sans-serif'>ÐÐ¾Ð²ÑÐµ</text><rect x='650' y='100' width='8' height='8' rx='2' fill='%238b5cf6'/><text x='663' y='108' fill='%23cbd5e1' font-size='9' font-family='sans-serif'>ÐÐºÑÐ¸Ð²Ð½ÑÐµ</text><rect x='650' y='120' width='8' height='8' rx='2' fill='%23ec4899'/><text x='663' y='128' fill='%23cbd5e1' font-size='9' font-family='sans-serif'>VIP</text><rect x='30' y='205' width='370' height='165' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='55' y='230' fill='%23cbd5e1' font-size='13' font-weight='600' font-family='sans-serif'>ÐÐ¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ ÐºÐ¾Ð½ÑÐ°ÐºÑÑ</text><rect x='55' y='243' width='330' height='1' fill='%23374151'/><circle cx='75' cy='268' r='14' fill='%236366f1' opacity='.4'/><text x='75' y='273' text-anchor='middle' fill='%236366f1' font-size='12' font-family='sans-serif'>AK</text><rect x='98' y='261' width='100' height='8' rx='4' fill='%234b5563'/><rect x='98' y='274' width='65' height='7' rx='3' fill='%23374151'/><rect x='310' y='262' width='55' height='20' rx='8' fill='%236366f1' opacity='.2'/><text x='337' y='276' text-anchor='middle' fill='%236366f1' font-size='9' font-family='sans-serif'>ÐÐ¾Ð²ÑÐ¹</text><circle cx='75' cy='303' r='14' fill='%238b5cf6' opacity='.4'/><text x='75' y='308' text-anchor='middle' fill='%238b5cf6' font-size='12' font-family='sans-serif'>MN</text><rect x='98' y='296' width='115' height='8' rx='4' fill='%234b5563'/><rect x='98' y='309' width='75' height='7' rx='3' fill='%23374151'/><rect x='300' y='297' width='65' height='20' rx='8' fill='%234ade80' opacity='.2'/><text x='332' y='311' text-anchor='middle' fill='%234ade80' font-size='9' font-family='sans-serif'>Ð¡Ð´ÐµÐ»ÐºÐ°</text><circle cx='75' cy='338' r='14' fill='%23ec4899' opacity='.4'/><text x='75' y='343' text-anchor='middle' fill='%23ec4899' font-size='12' font-family='sans-serif'>SL</text><rect x='98' y='331' width='90' height='8' rx='4' fill='%234b5563'/><rect x='98' y='344' width='60' height='7' rx='3' fill='%23374151'/><rect x='308' y='332' width='57' height='20' rx='8' fill='%23ec4899' opacity='.2'/><text x='336' y='346' text-anchor='middle' fill='%23ec4899' font-size='9' font-family='sans-serif'>VIP</text><rect x='420' y='205' width='350' height='165' rx='12' fill='%231e293b' stroke='%238b5cf6' stroke-width='1'/><text x='445' y='230' fill='%23cbd5e1' font-size='13' font-weight='600' font-family='sans-serif'>1C ÐÐ½ÑÐµÐ³ÑÐ°ÑÐ¸Ñ</text><rect x='445' y='248' width='60' height='40' rx='6' fill='%236366f1' opacity='.3'/><text x='475' y='273' text-anchor='middle' fill='%236366f1' font-size='10' font-family='sans-serif'>CRM</text><rect x='525' y='248' width='60' height='40' rx='6' fill='%238b5cf6' opacity='.3'/><text x='555' y='273' text-anchor='middle' fill='%238b5cf6' font-size='10' font-family='sans-serif'>1C</text><rect x='605' y='248' width='60' height='40' rx='6' fill='%23ec4899' opacity='.3'/><text x='635' y='273' text-anchor='middle' fill='%23ec4899' font-size='10' font-family='sans-serif'>Email</text><line x1='505' y1='268' x2='525' y2='268' stroke='%236366f1' stroke-width='2' stroke-dasharray='3,2'/><line x1='585' y1='268' x2='605' y2='268' stroke='%238b5cf6' stroke-width='2' stroke-dasharray='3,2'/><rect x='450' y='310' width='310' height='40' rx='8' fill='%23374151'/><text x='465' y='335' fill='%23cbd5e1' font-size='11' font-family='sans-serif'>Ð¡Ð¸Ð½ÑÑÐ¾Ð½Ð¸Ð·Ð°ÑÐ¸Ñ: </text><text x='640' y='335' fill='%234ade80' font-size='11' font-weight='600' font-family='sans-serif'>â ÐÐºÑÐ¸Ð²Ð½Ð°</text>`,

  // AI: Ð½ÐµÐ¹ÑÐ¾ÑÐµÑÑ Ñ ÑÐ·Ð»Ð°Ð¼Ð¸
  ai: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'><defs><linearGradient id='bg-ai' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23111827'/><stop offset='100%' stop-color='%230f172a'/></linearGradient><linearGradient id='glow' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%23ec4899'/></linearGradient></defs><rect width='800' height='400' fill='url(%23bg-ai)'/><circle cx='80' cy='100' r='18' fill='%236366f1' opacity='.7'/><circle cx='80' cy='170' r='18' fill='%236366f1' opacity='.5'/><circle cx='80' cy='240' r='18' fill='%236366f1' opacity='.7'/><circle cx='80' cy='310' r='18' fill='%236366f1' opacity='.5'/><circle cx='220' cy='80' r='22' fill='%238b5cf6' opacity='.8'/><circle cx='220' cy='155' r='22' fill='%238b5cf6' opacity='.6'/><circle cx='220' cy='245' r='22' fill='%238b5cf6' opacity='.8'/><circle cx='220' cy='320' r='22' fill='%238b5cf6' opacity='.6'/><circle cx='370' cy='60' r='26' fill='%23a78bfa' opacity='.9'/><circle cx='370' cy='145' r='26' fill='%23a78bfa' opacity='.7'/><circle cx='370' cy='255' r='26' fill='%23a78bfa' opacity='.9'/><circle cx='370' cy='340' r='26' fill='%23a78bfa' opacity='.7'/><circle cx='520' cy='80' r='22' fill='%238b5cf6' opacity='.8'/><circle cx='520' cy='200' r='22' fill='%238b5cf6' opacity='.6'/><circle cx='520' cy='320' r='22' fill='%238b5cf6' opacity='.8'/><circle cx='660' cy='130' r='18' fill='%236366f1' opacity='.7'/><circle cx='660' cy='200' r='18' fill='%236366f1' opacity='.5'/><circle cx='660' cy='270' r='18' fill='%236366f1' opacity='.7'/><line x1='95' y1='105' x2='202' y2='100' stroke='%236366f1' stroke-width='1.5' opacity='.4'/><line x1='95' y1='108' x2='202' y2='140' stroke='%236366f1' stroke-width='1.5' opacity='.3'/><line x1='95' y1='172' x2='202' y2='100' stroke='%236366f1' stroke-width='1.5' opacity='.3'/><line x1='95' y1='175' x2='202' y2='160' stroke='%236366f1' stroke-width='1.5' opacity='.4'/><line x1='95' y1='178' x2='202' y2='250' stroke='%236366f1' stroke-width='1.5' opacity='.2'/><line x1='95' y1='242' x2='202' y2='160' stroke='%236366f1' stroke-width='1.5' opacity='.3'/><line x1='95' y1='245' x2='202' y2='250' stroke='%236366f1' stroke-width='1.5' opacity='.4'/><line x1='95' y1='248' x2='202' y2='320' stroke='%236366f1' stroke-width='1.5' opacity='.2'/><line x1='95' y1='312' x2='202' y2='250' stroke='%236366f1' stroke-width='1.5' opacity='.3'/><line x1='95' y1='315' x2='202' y2='320' stroke='%236366f1' stroke-width='1.5' opacity='.4'/><line x1='239' y1='90' x2='348' y2='68' stroke='%238b5cf6' stroke-width='1.5' opacity='.4'/><line x1='239' y1='95' x2='348' y2='150' stroke='%238b5cf6' stroke-width='1.5' opacity='.3'/><line x1='239' y1='160' x2='348' y2='68' stroke='%238b5cf6' stroke-width='1.5' opacity='.3'/><line x1='239' y1='165' x2='348' y2='150' stroke='%238b5cf6' stroke-width='1.5' opacity='.4'/><line x1='239' y1='168' x2='348' y2='260' stroke='%238b5cf6' stroke-width='1.5' opacity='.2'/><line x1='239' y1='255' x2='348' y2='150' stroke='%238b5cf6' stroke-width='1.5' opacity='.3'/><line x1='239' y1='258' x2='348' y2='260' stroke='%238b5cf6' stroke-width='1.5' opacity='.4'/><line x1='239' y1='325' x2='348' y2='260' stroke='%238b5cf6' stroke-width='1.5' opacity='.3'/><line x1='239' y1='328' x2='348' y2='340' stroke='%238b5cf6' stroke-width='1.5' opacity='.4'/><line x1='392' y1='70' x2='502' y2='88' stroke='%23a78bfa' stroke-width='1.5' opacity='.4'/><line x1='392' y1='75' x2='502' y2='205' stroke='%23a78bfa' stroke-width='1.5' opacity='.2'/><line x1='392' y1='150' x2='502' y2='88' stroke='%23a78bfa' stroke-width='1.5' opacity='.3'/><line x1='392' y1='155' x2='502' y2='205' stroke='%23a78bfa' stroke-width='1.5' opacity='.4'/><line x1='392' y1='260' x2='502' y2='205' stroke='%23a78bfa' stroke-width='1.5' opacity='.4'/><line x1='392' y1='265' x2='502' y2='320' stroke='%23a78bfa' stroke-width='1.5' opacity='.3'/><line x1='392' y1='345' x2='502' y2='320' stroke='%23a78bfa' stroke-width='1.5' opacity='.4'/><line x1='539' y1='88' x2='645' y2='135' stroke='%238b5cf6' stroke-width='1.5' opacity='.4'/><line x1='539' y1='92' x2='645' y2='205' stroke='%238b5cf6' stroke-width='1.5' opacity='.3'/><line x1='539' y1='205' x2='645' y2='135' stroke='%238b5cf6' stroke-width='1.5' opacity='.3'/><line x1='539' y1='208' x2='645' y2='205' stroke='%238b5cf6' stroke-width='1.5' opacity='.4'/><line x1='539' y1='210' x2='645' y2='275' stroke='%238b5cf6' stroke-width='1.5' opacity='.2'/><line x1='539' y1='322' x2='645' y2='275' stroke='%238b5cf6' stroke-width='1.5' opacity='.3'/><text x='80' y='104' text-anchor='middle' fill='white' font-size='8' font-weight='600' font-family='sans-serif'>IN</text><text x='220' y='87' text-anchor='middle' fill='white' font-size='9' font-weight='600' font-family='sans-serif'>H1</text><text x='370' y='70' text-anchor='middle' fill='white' font-size='10' font-weight='700' font-family='sans-serif'>H2</text><text x='520' y='87' text-anchor='middle' fill='white' font-size='9' font-weight='600' font-family='sans-serif'>H3</text><text x='660' y='135' text-anchor='middle' fill='white' font-size='8' font-weight='600' font-family='sans-serif'>OUT</text><rect x='30' y='5' width='740' height='22' rx='6' fill='%231e293b' opacity='.8'/><text x='400' y='21' text-anchor='middle' fill='%23cbd5e1' font-size='12' font-family='sans-serif' font-weight='600'>Neural Network â GPT-4 Architecture</text><circle cx='80' cy='100' r='6' fill='%23ec4899'/><circle cx='220' cy='155' r='5' fill='%23ec4899'/><circle cx='370' cy='145' r='6' fill='%23ec4899'/><circle cx='520' cy='200' r='5' fill='%23ec4899'/><circle cx='660' cy='200' r='4' fill='%23ec4899'/>`,

  // Intranet: ÐºÐ¾ÑÐ¿Ð¾ÑÐ°ÑÐ¸Ð²Ð½ÑÐ¹ Ð¿Ð¾ÑÑÐ°Ð» Ñ Ð½Ð°Ð²Ð¸Ð³Ð°ÑÐ¸ÐµÐ¹
  intranet: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'><defs><linearGradient id='bg-int' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23111827'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='800' height='400' fill='url(%23bg-int)'/><rect x='0' y='0' width='800' height='48' fill='%231e293b'/><rect x='20' y='14' width='24' height='24' rx='6' fill='%236366f1'/><text x='32' y='31' text-anchor='middle' fill='white' font-size='13' font-weight='700' font-family='sans-serif'>P</text><rect x='55' y='18' width='60' height='14' rx='4' fill='%234b5563'/><rect x='125' y='18' width='60' height='14' rx='4' fill='%234b5563'/><rect x='195' y='18' width='50' height='14' rx='4' fill='%23374151'/><circle cx='740' cy='25' r='12' fill='%236366f1' opacity='.5'/><text x='740' y='30' text-anchor='middle' fill='white' font-size='11' font-family='sans-serif'>AK</text><rect x='20' y='58' width='150' height='335' rx='10' fill='%231e293b'/><rect x='35' y='75' width='120' height='32' rx='8' fill='%236366f1'/><text x='95' y='96' text-anchor='middle' fill='white' font-size='11' font-family='sans-serif'>ð   ÐÐ»Ð°Ð²Ð½Ð°Ñ</text><rect x='35' y='117' width='120' height='28' rx='6' fill='%23374151'/><text x='95' y='136' text-anchor='middle' fill='%23cbd5e1' font-size='10' font-family='sans-serif'>ð ÐÐ¾ÐºÑÐ¼ÐµÐ½ÑÑ</text><rect x='35' y='155' width='120' height='28' rx='6' fill='%23374151'/><text x='95' y='174' text-anchor='middle' fill='%23cbd5e1' font-size='10' font-family='sans-serif'>ð¥ HR</text><rect x='35' y='193' width='120' height='28' rx='6' fill='%23374151'/><text x='95' y='212' text-anchor='middle' fill='%23cbd5e1' font-size='10' font-family='sans-serif'>ð¬ Ð§Ð°Ñ</text><rect x='35' y='231' width='120' height='28' rx='6' fill='%23374151'/><text x='95' y='250' text-anchor='middle' fill='%23cbd5e1' font-size='10' font-family='sans-serif'>ð ÐÑÑÑÑÑ</text><rect x='35' y='269' width='120' height='28' rx='6' fill='%23374151'/><text x='95' y='288' text-anchor='middle' fill='%23cbd5e1' font-size='10' font-family='sans-serif'>âï¸  ÐÐ°ÑÑÑÐ¾Ð¹ÐºÐ¸</text><rect x='185' y='58' width='330' height='90' rx='10' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='210' y='82' fill='%23cbd5e1' font-size='12' font-weight='600' font-family='sans-serif'>ÐÐ¾Ð±ÑÐ¾ Ð¿Ð¾Ð¶Ð°Ð»Ð¾Ð²Ð°ÑÑ, ÐÐ»ÐµÐºÑÐµÐ¹</text><rect x='210' y='95' width='200' height='8' rx='4' fill='%23374151'/><rect x='210' y='110' width='150' height='8' rx='4' fill='%23374151'/><rect x='440' y='75' width='60' height='56' rx='8' fill='%236366f1' opacity='.2'/><text x='470' y='108' text-anchor='middle' fill='%236366f1' font-size='22' font-family='sans-serif'>ð</text><rect x='185' y='158' width='155' height='100' rx='10' fill='%231e293b' stroke='%238b5cf6' stroke-width='1'/><text x='210' y='180' fill='%23cbd5e1' font-size='11' font-weight='600' font-family='sans-serif'>ÐÐ¾ÐºÑÐ¼ÐµÐ½ÑÑ</text><rect x='210' y='193' width='115' height='22' rx='5' fill='%23374151'/><text x='222' y='208' fill='%23cbd5e1' font-size='9' font-family='sans-serif'>ð ÐÑÑÑÑ Q4.pdf</text><rect x='210' y='222' width='115' height='22' rx='5' fill='%23374151'/><text x='222' y='237' fill='%23cbd5e1' font-size='9' font-family='sans-serif'>ð ÐÐ¾Ð½ÑÑÐ°ÐºÑ 2025</text><rect x='350' y='158' width='165' height='100' rx='10' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='375' y='180' fill='%23cbd5e1' font-size='11' font-weight='600' font-family='sans-serif'>ÐÐ¾Ð²Ð¾ÑÑÐ¸ ÐºÐ¾Ð¼Ð¿Ð°Ð½Ð¸Ð¸</text><rect x='375' y='193' width='130' height='8' rx='4' fill='%23374151'/><rect x='375' y='207' width='110' height='8' rx='4' fill='%23374151'/><rect x='375' y='221' width='120' height='8' rx='4' fill='%23374151'/><rect x='375' y='235' width='80' height='8' rx='4' fill='%236366f1' opacity='.5'/><rect x='185' y='268' width='330' height='125' rx='10' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='210' y='292' fill='%23cbd5e1' font-size='11' font-weight='600' font-family='sans-serif'>Ð¡ÑÐ°ÑÐ¸ÑÑÐ¸ÐºÐ° Ð¸ÑÐ¿Ð¾Ð»ÑÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ</text><rect x='210' y='305' width='80' height='70' rx='6' fill='%23374151'/><rect x='215' y='355' width='16' height='16' rx='2' fill='%236366f1'/><rect x='237' y='345' width='16' height='26' rx='2' fill='%238b5cf6'/><rect x='259' y='335' width='16' height='36' rx='2' fill='%23ec4899'/><rect x='310' y='305' width='195' height='70' rx='6' fill='%23374151'/><circle cx='345' cy='340' r='24' fill='none' stroke='%236366f1' stroke-width='6' stroke-dasharray='75 75' stroke-linecap='round'/><circle cx='345' cy='340' r='24' fill='none' stroke='%238b5cf6' stroke-width='6' stroke-dasharray='50 100' stroke-dashoffset='-75' stroke-linecap='round'/><circle cx='345' cy='340' r='12' fill='%23374151'/><rect x='380' y='310' width='8' height='8' rx='2' fill='%236366f1'/><text x='393' y='318' fill='%23cbd5e1' font-size='8' font-family='sans-serif'>ÐÐ¾ÐºÑÐ¼ÐµÐ½ÑÑ</text><rect x='380' y='325' width='8' height='8' rx='2' fill='%238b5cf6'/><text x='393' y='333' fill='%23cbd5e1' font-size='8' font-family='sans-serif'>HR</text><rect x='380' y='340' width='8' height='8' rx='2' fill='%23ec4899'/><text x='393' y='348' fill='%23cbd5e1' font-size='8' font-family='sans-serif'>Ð§Ð°Ñ</text><rect x='525' y='58' width='255' height='335' rx='10' fill='%231e293b'/><text x='550' y='82' fill='%23cbd5e1' font-size='12' font-weight='600' font-family='sans-serif'>Ð§Ð°Ñ</text><rect x='540' y='95' width='235' height='55' rx='8' fill='%23374151'/><circle cx='558' cy='122' r='12' fill='%236366f1' opacity='.5'/><text x='558' y='127' text-anchor='middle' fill='white' font-size='9' font-family='sans-serif'>MN</text><rect x='578' y='108' width='180' height='8' rx='4' fill='%234b5563'/><rect x='578' y='122' width='130' height='8' rx='4' fill='%234b5563'/><rect x='540' y='160' width='235' height='45' rx='8' fill='%23374151'/><circle cx='558' cy='182' r='12' fill='%238b5cf6' opacity='.5'/><text x='558' y='187' text-anchor='middle' fill='white' font-size='9' font-family='sans-serif'>SL</text><rect x='578' y='173' width='150' height='8' rx='4' fill='%234b5563'/><rect x='578' y='187' width='100' height='8' rx='4' fill='%234b5563'/><rect x='540' y='215' width='235' height='45' rx='8' fill='%236366f1' opacity='.15' stroke='%236366f1' stroke-width='.5'/><rect x='578' y='226' width='160' height='8' rx='4' fill='%236366f1' opacity='.4'/><rect x='578' y='240' width='90' height='8' rx='4' fill='%236366f1' opacity='.3'/><rect x='540' y='275' width='235' height='100' rx='8' fill='%23374151'/><rect x='555' y='290' width='205' height='30' rx='6' fill='%231e293b'/><text x='652' y='311' text-anchor='middle' fill='%23cbd5e1' font-size='11' font-family='sans-serif'>ÐÐ²ÐµÐ´Ð¸ÑÐµ ÑÐ¾Ð¾Ð±ÑÐµÐ½Ð¸Ðµ...</text><rect x='555' y='330' width='90' height='28' rx='6' fill='%236366f1'/><text x='600' y='349' text-anchor='middle' fill='white' font-size='10' font-family='sans-serif'>ÐÑÐ¿ÑÐ°Ð²Ð¸ÑÑ</text>`,

  // Delivery: ÐºÐ°ÑÑÐ° Ñ Ð¼Ð°ÑÑÑÑÑÐ°Ð¼Ð¸
  delivery: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'><defs><linearGradient id='bg-del' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23111827'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='800' height='400' fill='url(%23bg-del)'/><rect x='20' y='20' width='480' height='360' rx='12' fill='%231e293b'/><rect x='20' y='20' width='480' height='30' rx='12' fill='%23374151'/><text x='45' y='40' fill='%23cbd5e1' font-size='11' font-weight='600' font-family='sans-serif'>GPS Tracking â ÐÐ°ÑÑÑÑÑÑ</text><rect x='60' y='80' width='50' height='50' rx='6' fill='%23374151' opacity='.6'/><rect x='140' y='60' width='80' height='40' rx='6' fill='%23374151' opacity='.5'/><rect x='260' y='100' width='100' height='60' rx='6' fill='%23374151' opacity='.4'/><rect x='200' y='200' width='70' height='50' rx='6' fill='%23374151' opacity='.5'/><rect x='350' y='180' width='90' height='55' rx='6' fill='%23374151' opacity='.4'/><rect x='100' y='250' width='60' height='70' rx='6' fill='%23374151' opacity='.5'/><rect x='300' y='280' width='80' height='60' rx='6' fill='%23374151' opacity='.4'/><polyline points='85,80 145,95 175,130 220,160 255,225 280,260 320,290' fill='none' stroke='%236366f1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='6,4'/><polyline points='200,60 230,85 270,110 300,160 340,195 370,210 400,250' fill='none' stroke='%234ade80' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='6,4'/><polyline points='150,280 180,260 210,230 250,200 290,170 330,140 380,120' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' stroke-dasharray='4,3' opacity='.7'/><circle cx='85' cy='80' r='7' fill='%236366f1'/><circle cx='85' cy='80' r='12' fill='%236366f1' opacity='.2'/><circle cx='320' cy='290' r='7' fill='%236366f1'/><circle cx='320' cy='290' r='12' fill='%236366f1' opacity='.2'/><circle cx='200' cy='60' r='7' fill='%234ade80'/><circle cx='200' cy='60' r='12' fill='%234ade80' opacity='.2'/><circle cx='400' cy='250' r='7' fill='%234ade80'/><circle cx='400' cy='250' r='12' fill='%234ade80' opacity='.2'/><circle cx='150' cy='280' r='6' fill='%23ec4899'/><circle cx='380' cy='120' r='6' fill='%23ec4899'/><polygon points='85,68 78,56 92,56' fill='%236366f1'/><text x='85' y='53' text-anchor='middle' fill='white' font-size='7' font-weight='600' font-family='sans-serif'>C1</text><polygon points='200,48 193,36 207,36' fill='%234ade80'/><text x='200' y='33' text-anchor='middle' fill='white' font-size='7' font-weight='600' font-family='sans-serif'>C2</text><rect x='520' y='20' width='260' height='140' rx='10' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='545' y='44' fill='%23cbd5e1' font-size='12' font-weight='600' font-family='sans-serif'>ÐÑÑÑÐµÑÑ</text><rect x='540' y='55' width='240' height='1' fill='%23374151'/><circle cx='558' cy='78' r='8' fill='%236366f1'/><text x='558' y='82' text-anchor='middle' fill='white' font-size='7' font-family='sans-serif'>C1</text><rect x='575' y='72' width='80' height='8' rx='4' fill='%234b5563'/><rect x='665' y='70' width='50' height='16' rx='8' fill='%236366f1' opacity='.2'/><text x='690' y='82' text-anchor='middle' fill='%236366f1' font-size='9' font-family='sans-serif'>Ð Ð¿ÑÑÐ¸</text><circle cx='558' cy='108' r='8' fill='%234ade80'/><text x='558' y='112' text-anchor='middle' fill='white' font-size='7' font-family='sans-serif'>C2</text><rect x='575' y='102' width='70' height='8' rx='4' fill='%234b5563'/><rect x='665' y='100' width='50' height='16' rx='8' fill='%234ade80' opacity='.2'/><text x='690' y='112' text-anchor='middle' fill='%234ade80' font-size='9' font-family='sans-serif'>ÐÐ¾ÑÑÐ°Ð²Ð¸Ð»</text><circle cx='558' cy='138' r='8' fill='%23ec4899'/><text x='558' y='142' text-anchor='middle' fill='white' font-size='7' font-family='sans-serif'>C3</text><rect x='575' y='132' width='75' height='8' rx='4' fill='%234b5563'/><rect x='665' y='130' width='50' height='16' rx='8' fill='%23ec4899' opacity='.2'/><text x='690' y='142' text-anchor='middle' fill='%23ec4899' font-size='9' font-family='sans-serif'>Ð¡ÐºÐ¾ÑÐ¾</text><rect x='520' y='170' width='260' height='105' rx='10' fill='%231e293b' stroke='%238b5cf6' stroke-width='1'/><text x='545' y='194' fill='%23cbd5e1' font-size='12' font-weight='600' font-family='sans-serif'>Ð¡ÑÐ°ÑÐ¸ÑÑÐ¸ÐºÐ° ÑÐµÐ³Ð¾Ð´Ð½Ñ</text><rect x='540' y='205' width='70' height='58' rx='8' fill='%23374151'/><text x='575' y='228' text-anchor='middle' fill='%236366f1' font-size='22' font-weight='700' font-family='sans-serif'>1K+</text><text x='575' y='248' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>ÐÐ¾ÑÑÐ°Ð²Ð¾Ðº</text><rect x='618' y='205' width='70' height='58' rx='8' fill='%23374151'/><text x='653' y='228' text-anchor='middle' fill='%234ade80' font-size='22' font-weight='700' font-family='sans-serif'>96%</text><text x='653' y='248' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>ÐÐ¾Ð²ÑÐµÐ¼Ñ</text><rect x='696' y='205' width='70' height='58' rx='8' fill='%23374151'/><text x='731' y='228' text-anchor='middle' fill='%23ec4899' font-size='22' font-weight='700' font-family='sans-serif'>23m</text><text x='731' y='248' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>Avg Ð²ÑÐµÐ¼Ñ</text><rect x='520' y='285' width='260' height='95' rx='10' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='545' y='309' fill='%23cbd5e1' font-size='12' font-weight='600' font-family='sans-serif'>Ð¢ÐµÐºÑÑÐ°Ñ Ð´Ð¾ÑÑÐ°Ð²ÐºÐ°</text><rect x='540' y='320' width='240' height='48' rx='8' fill='%23374151'/><circle cx='560' cy='344' r='10' fill='%236366f1'/><text x='560' y='348' text-anchor='middle' fill='white' font-size='8' font-family='sans-serif'>C1</text><rect x='578' y='335' width='130' height='8' rx='4' fill='%234b5563'/><rect x='578' y='349' width='80' height='7' rx='3' fill='%236366f1' opacity='.5'/><rect x='720' y='334' width='50' height='22' rx='6' fill='%234ade80' opacity='.2'/><text x='745' y='349' text-anchor='middle' fill='%234ade80' font-size='9' font-weight='600' font-family='sans-serif'>3 Ð¼Ð¸Ð½</text>`,

  // EdTech: Ð¾Ð±ÑÐ°Ð·Ð¾Ð²Ð°ÑÐµÐ»ÑÐ½Ð°Ñ Ð¿Ð»Ð°ÑÑÐ¾ÑÐ¼Ð°
  edtech: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'><defs><linearGradient id='bg-edu' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23111827'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='800' height='400' fill='url(%23bg-edu)'/><rect x='50' y='40' width='320' height='320' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><rect x='50' y='40' width='320' height='45' rx='12' fill='%23374151'/><circle cx='75' cy='62' r='8' fill='%236366f1'/><text x='75' y='66' text-anchor='middle' fill='white' font-size='7' font-family='sans-serif'>ð</text><text x='100' y='67' fill='%23cbd5e1' font-size='13' font-weight='600' font-family='sans-serif'>EduPlatform</text><rect x='70' y='105' width='280' height='120' rx='8' fill='%23374151'/><rect x='85' y='120' width='250' height='90' rx='6' fill='%231e293b'/><circle cx='210' cy='150' r='18' fill='%236366f1'/><polygon points='205,145 205,155 215,150' fill='white'/><rect x='85' y='175' width='120' height='3' rx='1.5' fill='%236366f1'/><rect x='205' y='175' width='40' height='3' rx='1.5' fill='%23374151'/><rect x='85' y='188' width='100' height='8' rx='4' fill='%234b5563'/><rect x='200' y='188' width='50' height='8' rx='4' fill='%234b5563'/><text x='265' y='195' fill='%236366f1' font-size='10' font-family='sans-serif'>12:34 / 45:00</text><rect x='70' y='240' width='280' height='110' rx='8' fill='%23374151'/><text x='85' y='263' fill='%23cbd5e1' font-size='11' font-weight='600' font-family='sans-serif'>Ð¡Ð¾Ð´ÐµÑÐ¶Ð°Ð½Ð¸Ðµ ÐºÑÑÑÐ°</text><rect x='85' y='275' width='250' height='20' rx='5' fill='%236366f1' opacity='.2'/><circle cx='95' cy='285' r='4' fill='%234ade80'/><text x='105' y='288' fill='%23cbd5e1' font-size='9' font-family='sans-serif'>1. ÐÐ²ÐµÐ´ÐµÐ½Ð¸Ðµ Ð² Ð¿ÑÐ¾Ð³ÑÐ°Ð¼Ð¼Ð¸ÑÐ¾Ð²Ð°Ð½Ð¸Ðµ</text><rect x='310' y='283' width='25' height='12' rx='6' fill='%234ade80' opacity='.3'/><text x='322' y='291' text-anchor='middle' fill='%234ade80' font-size='8' font-family='sans-serif'>â</text><rect x='85' y='300' width='250' height='20' rx='5' fill='%23374151'/><circle cx='95' cy='310' r='4' fill='%236366f1'/><text x='105' y='313' fill='%23cbd5e1' font-size='9' font-family='sans-serif'>2. ÐÑÐ½Ð¾Ð²Ñ JavaScript</text><rect x='85' y='325' width='250' height='20' rx='5' fill='%23374151'/><circle cx='95' cy='335' r='4' fill='%23374151' opacity='.5'/><text x='105' y='338' fill='%236b7280' font-size='9' font-family='sans-serif'>3. React Ð¸ ÐºÐ¾Ð¼Ð¿Ð¾Ð½ÐµÐ½ÑÑ</text><rect x='400' y='40' width='360' height='320' rx='12' fill='%231e293b' stroke='%238b5cf6' stroke-width='1'/><text x='425' y='70' fill='%23cbd5e1' font-size='14' font-weight='600' font-family='sans-serif'>Ð¡ÑÐ°ÑÐ¸ÑÑÐ¸ÐºÐ° Ð¾Ð±ÑÑÐµÐ½Ð¸Ñ</text><rect x='420' y='90' width='160' height='110' rx='10' fill='%23374151'/><text x='500' y='112' text-anchor='middle' fill='%236366f1' font-size='32' font-weight='700' font-family='sans-serif'>85%</text><text x='500' y='132' text-anchor='middle' fill='%237a7a8a' font-size='10' font-family='sans-serif'>ÐÑÐ¾Ð³ÑÐµÑÑ</text><circle cx='500' cy='160' r='28' fill='none' stroke='%23374151' stroke-width='4'/><circle cx='500' cy='160' r='28' fill='none' stroke='%236366f1' stroke-width='4' stroke-dasharray='148 175' stroke-linecap='round' transform='rotate(-90 500 160)'/><text x='500' y='183' text-anchor='middle' fill='%23cbd5e1' font-size='9' font-family='sans-serif'>12/14 ÑÑÐ¾ÐºÐ¾Ð²</text><rect x='595' y='90' width='150' height='110' rx='10' fill='%23374151'/><rect x='610' y='105' width='120' height='35' rx='6' fill='%231e293b'/><text x='670' y='120' text-anchor='middle' fill='%238b5cf6' font-size='18' font-weight='700' font-family='sans-serif'>24h</text><text x='670' y='135' text-anchor='middle' fill='%237a7a8a' font-size='8' font-family='sans-serif'>ÐÑÐµÐ¼Ñ Ð¾Ð±ÑÑÐµÐ½Ð¸Ñ</text><rect x='610' y='150' width='120' height='35' rx='6' fill='%231e293b'/><text x='670' y='165' text-anchor='middle' fill='%23ec4899' font-size='18' font-weight='700' font-family='sans-serif'>92%</text><text x='670' y='180' text-anchor='middle' fill='%237a7a8a' font-size='8' font-family='sans-serif'>Ð¡ÑÐµÐ´Ð½Ð¸Ð¹ Ð±Ð°Ð»Ð»</text><rect x='420' y='215' width='330' height='135' rx='10' fill='%23374151'/><text x='435' y='238' fill='%23cbd5e1' font-size='12' font-weight='600' font-family='sans-serif'>ÐÐ¾ÑÑÐ¸Ð¶ÐµÐ½Ð¸Ñ</text><rect x='435' y='250' width='150' height='90' rx='8' fill='%231e293b'/><circle cx='510' cy='275' r='15' fill='%236366f1' opacity='.2'/><text x='510' y='282' text-anchor='middle' fill='%236366f1' font-size='16' font-family='sans-serif'>ð</text><text x='510' y='302' text-anchor='middle' fill='%23cbd5e1' font-size='10' font-family='sans-serif'>ÐÐµÑÐ²ÑÐ¹ ÐºÑÑÑ</text><text x='510' y='318' text-anchor='middle' fill='%237a7a8a' font-size='8' font-family='sans-serif'>ÐÐ¾Ð»ÑÑÐµÐ½Ð¾ Ð²ÑÐµÑÐ°</text><rect x='595' y='250' width='150' height='90' rx='8' fill='%231e293b'/><circle cx='670' cy='275' r='15' fill='%238b5cf6' opacity='.2'/><text x='670' y='282' text-anchor='middle' fill='%238b5cf6' font-size='16' font-family='sans-serif'>â­</text><text x='670' y='302' text-anchor='middle' fill='%23cbd5e1' font-size='10' font-family='sans-serif'>ÐÑÐ»Ð¸ÑÐ½Ð¸Ðº</text><text x='670' y='318' text-anchor='middle' fill='%237a7a8a' font-size='8' font-family='sans-serif'>5 ÑÑÐ¾ÐºÐ¾Ð² Ð¿Ð¾Ð´ÑÑÐ´</text></svg>`,

  // Healthcare: Ð¼ÐµÐ´Ð¸ÑÐ¸Ð½ÑÐºÐ°Ñ ÑÐ¸ÑÑÐµÐ¼Ð°
  healthcare: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'><defs><linearGradient id='bg-hlth' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23111827'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='800' height='400' fill='url(%23bg-hlth)'/><rect x='40' y='30' width='350' height='340' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='65' y='60' fill='%23cbd5e1' font-size='14' font-weight='600' font-family='sans-serif'>ÐÐ°Ð½ÐµÐ»Ñ Ð²ÑÐ°ÑÐ°</text><rect x='60' y='80' width='310' height='85' rx='8' fill='%23374151'/><circle cx='90' cy='122' r='20' fill='%236366f1' opacity='.2'/><text x='90' y='130' text-anchor='middle' fill='%236366f1' font-size='16' font-family='sans-serif'>ð¤</text><text x='125' y='110' fill='%23cbd5e1' font-size='12' font-weight='600' font-family='sans-serif'>ÐÐ²Ð°Ð½Ð¾Ð² ÐÐµÑÑ Ð¡ÐµÑÐ³ÐµÐµÐ²Ð¸Ñ</text><text x='125' y='128' fill='%237a7a8a' font-size='9' font-family='sans-serif'>ÐÑÐ¶., 45 Ð»ÐµÑ</text><text x='125' y='143' fill='%237a7a8a' font-size='9' font-family='sans-serif'>ID: 12345-67890</text><rect x='280' y='105' width='75' height='24' rx='6' fill='%234ade80' opacity='.2'/><text x='317' y='122' text-anchor='middle' fill='%234ade80' font-size='10' font-family='sans-serif'>ÐÐ° Ð¿ÑÐ¸ÑÐ¼Ðµ</text><rect x='60' y='180' width='145' height='60' rx='8' fill='%23374151'/><text x='132' y='202' text-anchor='middle' fill='%236366f1' font-size='18' font-weight='700' font-family='sans-serif'>98.6Â°F</text><text x='132' y='220' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>Ð¢ÐµÐ¼Ð¿ÐµÑÐ°ÑÑÑÐ°</text><circle cx='80' cy='210' r='6' fill='%234ade80'/><rect x='225' y='180' width='145' height='60' rx='8' fill='%23374151'/><text x='297' y='202' text-anchor='middle' fill='%238b5cf6' font-size='18' font-weight='700' font-family='sans-serif'>120/80</text><text x='297' y='220' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>ÐÐ°Ð²Ð»ÐµÐ½Ð¸Ðµ</text><circle cx='245' cy='210' r='6' fill='%234ade80'/><rect x='60' y='255' width='145' height='60' rx='8' fill='%23374151'/><text x='132' y='277' text-anchor='middle' fill='%23ec4899' font-size='18' font-weight='700' font-family='sans-serif'>72 bpm</text><text x='132' y='295' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>ÐÑÐ»ÑÑ</text><circle cx='80' cy='285' r='6' fill='%234ade80'/><rect x='225' y='255' width='145' height='60' rx='8' fill='%23374151'/><text x='297' y='277' text-anchor='middle' fill='%236366f1' font-size='18' font-weight='700' font-family='sans-serif'>98%</text><text x='297' y='295' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>SpOâ</text><circle cx='245' cy='285' r='6' fill='%234ade80'/><rect x='60' y='330' width='310' height='30' rx='8' fill='%236366f1'/><text x='215' y='351' text-anchor='middle' fill='white' font-size='11' font-weight='600' font-family='sans-serif'>ÐÐ°Ð¿Ð¸ÑÐ°ÑÑ Ð´Ð¸Ð°Ð³Ð½Ð¾Ð·</text><rect x='420' y='30' width='350' height='160' rx='12' fill='%231e293b' stroke='%238b5cf6' stroke-width='1'/><text x='445' y='60' fill='%23cbd5e1' font-size='14' font-weight='600' font-family='sans-serif'>Ð Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð½Ð° ÑÐµÐ³Ð¾Ð´Ð½Ñ</text><rect x='440' y='75' width='310' height='35' rx='6' fill='%23374151'/><rect x='450' y='83' width='3' height='20' rx='1.5' fill='%236366f1'/><text x='465' y='90' fill='%23cbd5e1' font-size='10' font-weight='600' font-family='sans-serif'>09:00 - ÐÐ¾Ð½ÑÑÐ»ÑÑÐ°ÑÐ¸Ñ</text><text x='465' y='103' fill='%237a7a8a' font-size='8' font-family='sans-serif'>ÐÐ½Ð½Ð° ÐÐµÑÑÐ¾Ð²Ð°</text><rect x='440' y='115' width='310' height='35' rx='6' fill='%236366f1' opacity='.15'/><rect x='450' y='123' width='3' height='20' rx='1.5' fill='%236366f1'/><text x='465' y='130' fill='%236366f1' font-size='10' font-weight='600' font-family='sans-serif'>10:30 - Ð¢ÐµÐºÑÑÐ¸Ð¹ Ð¿ÑÐ¸ÑÐ¼</text><text x='465' y='143' fill='%236366f1' font-size='8' font-family='sans-serif'>ÐÐ²Ð°Ð½Ð¾Ð² Ð.Ð¡.</text><rect x='440' y='155' width='310' height='35' rx='6' fill='%23374151'/><rect x='450' y='163' width='3' height='20' rx='1.5' fill='%23ec4899'/><text x='465' y='170' fill='%23cbd5e1' font-size='10' font-weight='600' font-family='sans-serif'>12:00 - ÐÑÐ¼Ð¾ÑÑ</text><text x='465' y='183' fill='%237a7a8a' font-size='8' font-family='sans-serif'>ÐÐ¸ÑÐ°Ð¸Ð» Ð¡Ð¸Ð´Ð¾ÑÐ¾Ð²</text><rect x='420' y='210' width='350' height='160' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='445' y='240' fill='%23cbd5e1' font-size='14' font-weight='600' font-family='sans-serif'>Ð¡ÑÐ°ÑÐ¸ÑÑÐ¸ÐºÐ° ÐºÐ»Ð¸Ð½Ð¸ÐºÐ¸</text><rect x='440' y='255' width='100' height='100' rx='8' fill='%23374151'/><text x='490' y='283' text-anchor='middle' fill='%236366f1' font-size='24' font-weight='700' font-family='sans-serif'>1.2K</text><text x='490' y='303' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>ÐÐ°ÑÐ¸ÐµÐ½ÑÐ¾Ð²</text><text x='490' y='318' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>Ð² ÑÑÐ¾Ð¼ Ð¼ÐµÑÑÑÐµ</text><rect x='550' y='255' width='100' height='100' rx='8' fill='%23374151'/><text x='600' y='283' text-anchor='middle' fill='%234ade80' font-size='24' font-weight='700' font-family='sans-serif'>95%</text><text x='600' y='303' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>Ð£Ð´Ð¾Ð²Ð»ÐµÑÐ².</text><text x='600' y='318' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>Ð¿Ð°ÑÐ¸ÐµÐ½ÑÐ¾Ð²</text><rect x='660' y='255' width='100' height='100' rx='8' fill='%23374151'/><text x='710' y='283' text-anchor='middle' fill='%238b5cf6' font-size='24' font-weight='700' font-family='sans-serif'>42</text><text x='710' y='303' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>ÐÑÐ°ÑÐµÐ¹</text><text x='710' y='318' text-anchor='middle' fill='%237a7a8a' font-size='9' font-family='sans-serif'>Ð² ÑÑÐ°ÑÐµ</text></svg>`,

  // IoT: ÑÐ¼Ð½ÑÐ¹ Ð´Ð¾Ð¼
  iot: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'><defs><linearGradient id='bg-iot' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23111827'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='800' height='400' fill='url(%23bg-iot)'/><rect x='40' y='30' width='360' height='340' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='65' y='60' fill='%23cbd5e1' font-size='14' font-weight='600' font-family='sans-serif'>ð  Ð£Ð¼Ð½ÑÐ¹ Ð´Ð¾Ð¼</text><rect x='330' y='45' width='55' height='22' rx='11' fill='%234ade80' opacity='.2'/><text x='357' y='61' text-anchor='middle' fill='%234ade80' font-size='10' font-family='sans-serif'>Online</text><rect x='60' y='85' width='160' height='120' rx='10' fill='%23374151'/><text x='140' y='108' text-anchor='middle' fill='%23cbd5e1' font-size='11' font-weight='600' font-family='sans-serif'>Ð¢ÐµÐ¼Ð¿ÐµÑÐ°ÑÑÑÐ°</text><text x='140' y='148' text-anchor='middle' fill='%236366f1' font-size='36' font-weight='700' font-family='sans-serif'>22Â°</text><circle cx='140' cy='180' r='12' fill='%236366f1' opacity='.2'/><text x='140' y='185' text-anchor='middle' fill='%236366f1' font-size='10' font-family='sans-serif'>ð¡ï¸</text><rect x='235' y='85' width='160' height='120' rx='10' fill='%23374151'/><text x='315' y='108' text-anchor='middle' fill='%23cbd5e1' font-size='11' font-weight='600' font-family='sans-serif'>ÐÑÐ²ÐµÑÐµÐ½Ð¸Ðµ</text><circle cx='315' cy='145' r='22' fill='%23fbbf24' opacity='.3'/><circle cx='315' cy='145' r='14' fill='%23fbbf24'/><text x='315' y='152' text-anchor='middle' fill='white' font-size='14' font-family='sans-serif'>ð¡</text><rect x='275' y='175' width='80' height='20' rx='10' fill='%236366f1'/><circle cx='343' cy='185' r='7' fill='white'/><rect x='60' y='220' width='160' height='85' rx='10' fill='%23374151'/><text x='140' y='243' text-anchor='middle' fill='%23cbd5e1' font-size='11' font-weight='600' font-family='sans-serif'>ÐÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾ÑÑÑ</text><circle cx='140' cy='270' r='16' fill='%234ade80' opacity='.2'/><text x='140' y='277' text-anchor='middle' fill='%234ade80' font-size='16' font-family='sans-serif'>ð</text><text x='140' y='296' text-anchor='middle' fill='%234ade80' font-size='10' font-family='sans-serif'>ÐÑÐµ Ð² Ð½Ð¾ÑÐ¼Ðµ</text><rect x='235' y='220' width='160' height='85' rx='10' fill='%23374151'/><text x='315' y='243' text-anchor='middle' fill='%23cbd5e1' font-size='11' font-weight='600' font-family='sans-serif'>ÐÐ°Ð¼ÐµÑÑ</text><rect x='255' y='255' width='40' height='30' rx='4' fill='%236366f1' opacity='.2'/><circle cx='275' cy='270' r='6' fill='%236366f1'/><rect x='305' y='255' width='40' height='30' rx='4' fill='%234ade80' opacity='.2'/><circle cx='325' cy='270' r='6' fill='%234ade80'/><rect x='355' y='255' width='40' height='30' rx='4' fill='%236366f1' opacity='.2'/><circle cx='375' cy='270' r='6' fill='%236366f1'/><text x='315' y='296' text-anchor='middle' fill='%234ade80' font-size='9' font-family='sans-serif'>3 Ð°ÐºÑÐ¸Ð²Ð½Ñ</text><rect x='60' y='320' width='335' height='40' rx='10' fill='%236366f1'/><text x='227' y='345' text-anchor='middle' fill='white' font-size='12' font-weight='600' font-family='sans-serif'>ÐÐºÐ»ÑÑÐ¸ÑÑ ÑÐµÐ¶Ð¸Ð¼ Â«ÐÐ¾Ð¼Ð°Â»</text><rect x='420' y='30' width='350' height='165' rx='12' fill='%231e293b' stroke='%238b5cf6' stroke-width='1'/><text x='445' y='60' fill='%23cbd5e1' font-size='14' font-weight='600' font-family='sans-serif'>ÐÐºÑÐ¸Ð²Ð½Ð¾ÑÑÑ ÑÑÑÑÐ¾Ð¹ÑÑÐ²</text><rect x='440' y='75' width='310' height='110' rx='8' fill='%23374151'/><rect x='455' y='165' width='14' height='10' rx='2' fill='%236366f1'/><rect x='455' y='158' width='14' height='17' rx='2' fill='%236366f1'/><rect x='455' y='145' width='14' height='30' rx='2' fill='%236366f1'/><rect x='475' y='155' width='14' height='20' rx='2' fill='%238b5cf6'/><rect x='475' y='142' width='14' height='33' rx='2' fill='%238b5cf6'/><rect x='475' y='130' width='14' height='45' rx='2' fill='%238b5cf6'/><rect x='495' y='150' width='14' height='25' rx='2' fill='%23ec4899'/><rect x='495' y='138' width='14' height='37' rx='2' fill='%23ec4899'/><rect x='495' y='120' width='14' height='55' rx='2' fill='%23ec4899'/><rect x='515' y='145' width='14' height='30' rx='2' fill='%234ade80'/><rect x='515' y='135' width='14' height='40' rx='2' fill='%234ade80'/><rect x='515' y='115' width='14' height='60' rx='2' fill='%234ade80'/><rect x='535' y='140' width='14' height='35' rx='2' fill='%236366f1'/><rect x='535' y='125' width='14' height='50' rx='2' fill='%236366f1'/><rect x='535' y='110' width='14' height='65' rx='2' fill='%236366f1'/><rect x='555' y='135' width='14' height='40' rx='2' fill='%238b5cf6'/><rect x='555' y='118' width='14' height='57' rx='2' fill='%238b5cf6'/><rect x='555' y='105' width='14' height='70' rx='2' fill='%238b5cf6'/><rect x='575' y='142' width='14' height='33' rx='2' fill='%23ec4899'/><rect x='575' y='128' width='14' height='47' rx='2' fill='%23ec4899'/><rect x='575' y='110' width='14' height='65' rx='2' fill='%23ec4899'/><polyline points='460,150 480,145 500,135 520,128 540,122 560,118 580,125' fill='none' stroke='%234ade80' stroke-width='2' stroke-linecap='round'/><rect x='420' y='215' width='350' height='155' rx='12' fill='%231e293b' stroke='%236366f1' stroke-width='1'/><text x='445' y='245' fill='%23cbd5e1' font-size='14' font-weight='600' font-family='sans-serif'>ÐÐ¾Ð´ÐºÐ»ÑÑÐµÐ½Ð½ÑÐµ ÑÑÑÑÐ¾Ð¹ÑÑÐ²Ð°</text><rect x='440' y='260' width='100' height='100' rx='8' fill='%23374151'/><circle cx='490' cy='290' r='14' fill='%236366f1' opacity='.2'/><text x='490' y='297' text-anchor='middle' fill='%236366f1' font-size='16' font-family='sans-serif'>ð±</text><text x='490' y='318' text-anchor='middle' fill='%23cbd5e1' font-size='10' font-family='sans-serif'>iPhone</text><text x='490' y='333' text-anchor='middle' fill='%234ade80' font-size='8' font-family='sans-serif'>ÐÐ¾Ð´ÐºÐ»ÑÑÐµÐ½</text><rect x='550' y='260' width='100' height='100' rx='8' fill='%23374151'/><circle cx='600' cy='290' r='14' fill='%238b5cf6' opacity='.2'/><text x='600' y='297' text-anchor='middle' fill='%238b5cf6' font-size='16' font-family='sans-serif'>ð»</text><text x='600' y='318' text-anchor='middle' fill='%23cbd5e1' font-size='10' font-family='sans-serif'>MacBook</text><text x='600' y='333' text-anchor='middle' fill='%234ade80' font-size='8' font-family='sans-serif'>ÐÐ¾Ð´ÐºÐ»ÑÑÐµÐ½</text><rect x='660' y='260' width='100' height='100' rx='8' fill='%23374151'/><circle cx='710' cy='290' r='14' fill='%23ec4899' opacity='.2'/><text x='710' y='297' text-anchor='middle' fill='%23ec4899' font-size='16' font-family='sans-serif'>â</text><text x='710' y='318' text-anchor='middle' fill='%23cbd5e1' font-size='10' font-family='sans-serif'>Watch</text><text x='710' y='333' text-anchor='middle' fill='%237a7a8a' font-size='8' font-family='sans-serif'>ÐÐµ Ð°ÐºÑÐ¸Ð²ÐµÐ½</text></svg>`,
};

/** @type {PortfolioProject[]} */
const PORTFOLIO_PROJECTS = [
  {
    id: 'ecommerce',
        image: '/portfolio/ecommerce.svg',
    imageAlt: 'Premium e-commerce storefront and analytics dashboard',
    badge: 'Featured',
    categoryKey: 'cat_ecommerce',
    titleKey: 'project1_title',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Elasticsearch', 'AWS'],
    descKey: 'project1_desc',
    details: {
      ru: { problem: 'Клиенту нужен мультибрендовый маркетплейс с высокой конверсией и быстрым поиском.', solution: 'Собрали каталог с фильтрами, персональные витрины брендов, умные рекомендации и checkout в 2 клика.', result: 'Рост конверсии, стабильная обработка 10K+ заказов/мес, ускорение TTFB и LCP.', scope: 'UX/UI, архитектура, интеграции PIM/ERP/3PL, аналитика, CI/CD.' },
      ro: { problem: 'Clientul avea nevoie de un marketplace multi-brand cu cautare rapida.', solution: 'Am construit vitrine de brand, recomandari si checkout in 2 pasi.', result: 'Crestere conversie si 10K+ comenzi/luna.', scope: 'UX/UI, PIM/ERP/3PL, analytics, CI/CD.' },
      en: { problem: 'Needed a multi-brand marketplace with fast search and higher conversion.', solution: 'Built brand storefronts, smart recommendations and 2-step checkout.', result: 'Higher conversion and 10K+ orders/month.', scope: 'UX/UI, PIM/ERP/3PL, analytics, CI/CD.' }
    },
    link: '#',
    year: '2025'
  },
  {
    id: 'fintech',
        image: '/portfolio/fintech.svg',
    imageAlt: 'Mobile banking app with cards, transfers and analytics',
    badge: 'Fintech',
    categoryKey: 'cat_fintech',
    titleKey: 'project2_title',
    tags: ['Flutter', 'Kotlin', 'Swift', 'Firebase', 'Biometrics', 'OpenAPI'],
    descKey: 'project2_desc',
    details: {
      ru: { problem: 'Нужно безопасное мобильное банкинг-ядро с быстрыми платежами и KYC.', solution: 'Построили мобильные клиенты, антифрод, push-сценарии и интеграции с платежными провайдерами.', result: '99.9% аптайм, снижение отказов, рост MAU и удержания.', scope: 'KYC, карты, P2P, QR, Apple/Google Pay, мониторинг транзакций.' },
      ro: { problem: 'Necesitate de mobile banking sigur cu KYC si plati rapide.', solution: 'Aplicatii mobile, antifrauda, scenarii push si integrari plati.', result: '99.9% uptime si crestere MAU.', scope: 'KYC, carduri, P2P, QR, Apple/Google Pay.' },
      en: { problem: 'Secure mobile banking with KYC and fast payments.', solution: 'Mobile apps, anti-fraud, push journeys and payment integrations.', result: '99.9% uptime and MAU growth.', scope: 'KYC, cards, P2P, QR, Apple/Google Pay.' }
    },
    link: '#',
    year: '2024'
  },
  {
    id: 'crm',
        image: '/portfolio/crm.svg',
    imageAlt: 'Sales CRM with funnel, KPIs and automation',
    badge: 'B2B SaaS',
    categoryKey: 'cat_b2b',
    titleKey: 'project3_title',
    tags: ['Vue.js', 'Python', 'FastAPI', 'Redis', 'ClickHouse', '1C'],
    descKey: 'project3_desc',
    details: {
      ru: { problem: 'Разрозненные продажи, нет сквозной аналитики и прогнозов.', solution: 'Единая CRM с воронкой, скорингом, автодействиями и BI-отчетностью.', result: 'Рост конверсии 200% и прозрачные прогнозы выручки.', scope: 'Интеграции 1С/телефония/email, роль-модель, SLA, API.' },
      ro: { problem: 'Vanzari fragmentate si lipsa analiticii end-to-end.', solution: 'CRM unificat cu pipeline, scoring si BI.', result: 'Conversie +200% si forecast clar.', scope: 'Integrari 1C/telefonie/email, role-based access.' },
      en: { problem: 'Fragmented sales and no end-to-end analytics.', solution: 'Unified CRM with pipeline, scoring and BI.', result: '200% conversion increase and clear revenue forecast.', scope: '1C/telephony/email integrations, RBAC.' }
    },
    link: '#',
    year: '2025'
  },
  {
    id: 'ai',
        image: '/portfolio/ai.svg',
    imageAlt: 'AI assistant for support with omnichannel routing',
    badge: 'AI Ops',
    categoryKey: 'cat_ai',
    titleKey: 'project4_title',
    tags: ['GPT-4', 'RAG', 'Vector DB', 'Telegram', 'WhatsApp', 'CRM'],
    descKey: 'project4_desc',
    details: {
      ru: { problem: 'Высокая нагрузка на саппорт и долгие ответы клиентам.', solution: 'AI-бот с RAG, маршрутизацией и контролем качества ответов.', result: 'Сокращение времени ответа на 80%, поддержка 24/7.', scope: 'База знаний, NLP, омниканал, мониторинг, аналитика тем.' },
      ro: { problem: 'Suport supraincarcat si timp mare de raspuns.', solution: 'Bot AI cu RAG si rutare catre operatori.', result: 'Raspunsuri mai rapide cu 80%.', scope: 'Omnichannel, analytics, monitoring.' },
      en: { problem: 'Support overloaded with slow response times.', solution: 'AI bot with RAG and smart routing to operators.', result: '80% faster replies and 24/7 coverage.', scope: 'Omnichannel, analytics, monitoring.' }
    },
    link: '#',
    year: '2024'
  },
  {
    id: 'intranet',
        image: '/portfolio/intranet.svg',
    imageAlt: 'Corporate intranet with documents and HR modules',
    badge: 'Enterprise',
    categoryKey: 'cat_portal',
    titleKey: 'project5_title',
    tags: ['Angular', '.NET', 'MongoDB', 'SSO', 'Azure', 'PowerBI'],
    descKey: 'project5_desc',
    details: {
      ru: { problem: 'Документы и HR-процессы разбросаны по сервисам, нет единого входа.', solution: 'Интранет с SSO/AD, заявками, согласованиями и корпоративными новостями.', result: 'Цифровизация процессов и рост эффективности команд.', scope: 'Роли, аудит, BI-дашборды, интеграции с внутренними системами.' },
      ro: { problem: 'Procese HR si documente dispersate.', solution: 'Intranet cu SSO/AD si fluxuri de aprobare.', result: 'Digitalizare si eficienta crescuta.', scope: 'BI dashboards, audit, integrari interne.' },
      en: { problem: 'Scattered HR and document workflows.', solution: 'Intranet with SSO/AD and approvals.', result: 'Process digitization and higher efficiency.', scope: 'BI dashboards, audit, internal integrations.' }
    },
    link: '#',
    year: '2024'
  },
  {
    id: 'delivery',
        image: '/portfolio/delivery.svg',
    imageAlt: 'Logistics dashboard with live courier tracking',
    badge: 'Logistics',
    categoryKey: 'cat_logistics',
    titleKey: 'project6_title',
    tags: ['React', 'Node.js', 'PostGIS', 'Mapbox', 'Flutter', 'WebSockets'],
    descKey: 'project6_desc',
    details: {
      ru: { problem: 'Нет контроля курьеров и статусов доставки в реальном времени.', solution: 'Диспетчерский центр, мобильное приложение курьера, ETA и маршрутизация.', result: 'Сокращение времени доставки на 40%.', scope: 'GPS, WebSockets, оптимизация маршрутов, SLA-алерты.' },
      ro: { problem: 'Lipsa controlului livrarilor in timp real.', solution: 'Dispecerat, aplicatie curier, ETA si rute.', result: 'Timp de livrare redus cu 40%.', scope: 'GPS, WebSockets, optimizare rute.' },
      en: { problem: 'No real-time delivery control.', solution: 'Dispatch center, courier app, ETA and routing.', result: '40% faster deliveries.', scope: 'GPS, WebSockets, route optimization.' }
    },
    link: '#',
    year: '2024'
  },
  {
    id: 'edtech',
        image: '/portfolio/edtech.svg',
    imageAlt: 'Online learning platform with video and tests',
    badge: 'EdTech',
    categoryKey: 'cat_edtech',
    titleKey: 'project7_title',
    tags: ['Next.js', 'Node.js', 'WebRTC', 'SCORM', 'AWS', 'Stripe'],
    descKey: 'project7_desc',
    details: {
      ru: { problem: 'Нужно масштабируемое обучение с видео, тестами и оплатами.', solution: 'LMS с SCORM, видео-студией, тестированием и сертификацией.', result: '120K студентов и рост вовлеченности.', scope: 'WebRTC, платежи, прогресс-трекер, автоматизация сертификатов.' },
      ro: { problem: 'Necesitate LMS scalabil cu plati si certificari.', solution: 'Platforma cu SCORM, video si teste.', result: '120K studenti activi.', scope: 'WebRTC, plati, progress tracking.' },
      en: { problem: 'Need scalable LMS with payments and certification.', solution: 'SCORM-ready platform with video and tests.', result: '120K active learners.', scope: 'WebRTC, payments, progress tracking.' }
    },
    link: '#',
    year: '2025'
  },
  {
    id: 'healthcare',
        image: '/portfolio/healthcare.svg',
    imageAlt: 'Healthcare platform with EMR and telemedicine',
    badge: 'Healthcare',
    categoryKey: 'cat_healthcare',
    titleKey: 'project8_title',
    tags: ['React', 'Node.js', 'FHIR', 'HL7', 'PostgreSQL', 'SSO'],
    descKey: 'project8_desc',
    details: {
      ru: { problem: 'Разрозненные медданные и отсутствие телемедицины.', solution: 'EMR/FHIR платформа с онлайн-консультациями и интеграциями.', result: 'Единая карточка пациента и безопасный доступ.', scope: 'Роли, аудит, HL7/FHIR, интеграции с лабораториями.' },
      ro: { problem: 'Date medicale dispersate si lipsa telemedicinei.', solution: 'EMR/FHIR cu consultatii online.', result: 'Acces sigur la fisele pacientilor.', scope: 'HL7/FHIR, audit, integrari laborator.' },
      en: { problem: 'Disparate medical data and no telemedicine.', solution: 'EMR/FHIR platform with online consults.', result: 'Secure unified patient records.', scope: 'HL7/FHIR, audit, lab integrations.' }
    },
    link: '#',
    year: '2025'
  },
  {
    id: 'iot',
        image: '/portfolio/iot.svg',
    imageAlt: 'Smart home IoT dashboard and device monitoring',
    badge: 'IoT',
    categoryKey: 'cat_iot',
    titleKey: 'project9_title',
    tags: ['IoT', 'MQTT', 'Node.js', 'Flutter', 'Zigbee', 'AWS IoT'],
    descKey: 'project9_desc',
    details: {
      ru: { problem: 'Много IoT-устройств без единого контроля и сценариев.', solution: 'Панель управления, автоматизации и голосовые ассистенты.', result: 'Снижение энергопотребления и стабильный мониторинг.', scope: 'MQTT, Zigbee/Z-Wave, аварийные оповещения.' },
      ro: { problem: 'Dispozitive IoT fara control unificat.', solution: 'Panou de control si scenarii smart.', result: 'Economie energie si alerte rapide.', scope: 'MQTT, Zigbee/Z-Wave, notificari.' },
      en: { problem: 'Many IoT devices without unified control.', solution: 'Central dashboard with automation scenarios.', result: 'Lower energy use and faster incident alerts.', scope: 'MQTT, Zigbee/Z-Wave, notifications.' }
    },
    link: '#',
    year: '2024'
  },
  {
    id: 'proptech',
        image: '/portfolio/proptech.svg',
    imageAlt: 'Real estate platform with listings and CRM',
    badge: 'PropTech',
    categoryKey: 'cat_proptech',
    titleKey: 'project10_title',
    tags: ['Next.js', 'Node.js', 'Elasticsearch', 'Mapbox', 'CRM', 'Payments'],
    descKey: 'project10_desc',
    details: {
      ru: { problem: 'Нужна платформа для объектов и поток заявок из рекламы.', solution: 'Каталог, карта, умный подбор и CRM-воронки.', result: 'Рост конверсии лидов и ускорение обработки заявок.', scope: 'Интеграции с телефонией, рекламой, аналитикой и CRM.' },
      ro: { problem: 'Platforma pentru proprietati si lead-uri din ads.', solution: 'Catalog, harta, matching si CRM.', result: 'Conversie leaduri mai mare.', scope: 'Telefonie, ads, analytics, CRM.' },
      en: { problem: 'Property platform with lead inflow from ads.', solution: 'Catalog, map, smart matching and CRM funnels.', result: 'Higher lead conversion and faster handling.', scope: 'Telephony, ads, analytics, CRM.' }
    },
    link: '#',
    year: '2025'
  },
  {
    id: 'foodtech',
        image: '/portfolio/foodtech.svg',
    imageAlt: 'Restaurant ordering with QR menus and loyalty',
    badge: 'FoodTech',
    categoryKey: 'cat_foodtech',
    titleKey: 'project11_title',
    tags: ['React', 'Node.js', 'POS', 'QR', 'Stripe', 'Push'],
    descKey: 'project11_desc',
    details: {
      ru: { problem: 'Офлайн-заказы и очередь, низкая повторная покупка.', solution: 'QR-меню, онлайн-заказы, лояльность и интеграция с POS.', result: 'Рост заказов и среднего чека.', scope: 'Push-уведомления, промо-сценарии, аналитика продаж.' },
      ro: { problem: 'Comenzi offline si retentie slaba.', solution: 'Meniu QR, comenzi online, loialitate.', result: 'Crestere comenzi si bon mediu.', scope: 'POS, promotii, notificari.' },
      en: { problem: 'Offline orders and weak retention.', solution: 'QR menus, online ordering and loyalty.', result: 'More orders and higher average ticket.', scope: 'POS, promotions, notifications.' }
    },
    link: '#',
    year: '2024'
  },
  {
    id: 'hrtech',
        image: '/portfolio/hrtech.svg',
    imageAlt: 'Recruiting ATS and HR analytics dashboard',
    badge: 'HR Tech',
    categoryKey: 'cat_hrtech',
    titleKey: 'project12_title',
    tags: ['React', 'Node.js', 'PostgreSQL', 'AI', 'Slack', 'Calendar'],
    descKey: 'project12_desc',
    details: {
      ru: { problem: 'Долгий найм и ручные согласования.', solution: 'ATS с календарем, автоматизацией интервью и офферов.', result: 'Ускорение найма и прозрачная аналитика.', scope: 'Интеграции календарей, Slack/Email, отчеты.' },
      ro: { problem: 'Recrutare lenta si aprobari manuale.', solution: 'ATS cu calendar si automatizari.', result: 'Angajari mai rapide si analitica clara.', scope: 'Slack/Email, rapoarte, pipeline.' },
      en: { problem: 'Slow hiring and manual approvals.', solution: 'ATS with calendar and automation.', result: 'Faster hiring and clear analytics.', scope: 'Slack/Email, reports, pipeline.' }
    },
    link: '#',
    year: '2025'
  },
];

/**
 * Ð¡Ð¾Ð·Ð´Ð°ÑÑ HTML-ÐºÐ°ÑÑÐ¾ÑÐºÑ Ð¿ÑÐ¾ÐµÐºÑÐ° Ð´Ð»Ñ ÑÐµÐºÑÐ¸Ð¸ Â«ÐÐ°ÑÐ¸ Ð¿ÑÐ¾ÐµÐºÑÑÂ».
 * @param {PortfolioProject} project - ÐÐ°Ð½Ð½ÑÐµ Ð¿ÑÐ¾ÐµÐºÑÐ°
 * @returns {string} HTML-ÑÑÑÐ¾ÐºÐ° ÐºÐ°ÑÑÐ¾ÑÐºÐ¸
 */
function createPortfolioCard(project) {
  const lang = (typeof window !== 'undefined' && window.currentLang) ? window.currentLang : 'ru';
  const tagsHtml = project.tags
    .map((tag) => `<span class="portfolio-tag">${escapeHtml(tag)}</span>`)
    .join('\n                ');

  const stats = Array.isArray(project.stats) ? project.stats : [];
  const statsHtml = stats
    .map(
      (stat) => `
                    <div class="portfolio-stat">
                        <span class="portfolio-stat-value">${escapeHtml(stat.value)}</span>
                        <span class="portfolio-stat-label" data-translate="${escapeHtml(stat.labelKey)}"></span>
                    </div>`
    )
    .join('');

  // ÐÐµÐ·Ð¾Ð¿Ð°ÑÐ½ÑÐ¹ fallback Ð±ÐµÐ· inline ÑÐ¾Ð±ÑÑÐ¸Ð¹
  const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%236366f1" width="800" height="400"/%3E%3Ctext fill="white" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';

  return `
            <div class="portfolio-card" data-project-id="${escapeHtml(project.id)}">
            <div class="portfolio-image">
                <img src="${normalizeSvgDataUrl(project.image)}" 
                     alt="${escapeHtml(project.imageAlt)}" 
                     loading="lazy"
                     data-fallback="${fallbackImage}">
                <span class="portfolio-badge">${escapeHtml(project.badge)}</span>
            </div>
            <div class="portfolio-content">
                <button class="portfolio-toggle" type="button" aria-expanded="false">${lang === "en" ? "Details" : lang === "ro" ? "Detalii" : "\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435"}</button>
                <div class="portfolio-header">
                    <div class="portfolio-category" data-translate="${escapeHtml(project.categoryKey)}"></div>
                    <h3 data-translate="${escapeHtml(project.titleKey)}"></h3>
                </div>
                <div class="portfolio-tags">
                    ${tagsHtml}
                </div>
                <p data-translate="${escapeHtml(project.descKey)}"></p>
                <div class="portfolio-stats">
                    ${statsHtml}
                </div>
                <div class="portfolio-details" hidden>
                    <div class="portfolio-details-media">
                        <img src="${normalizeSvgDataUrl(project.detailsImage || project.image)}"
                             alt="${escapeHtml(project.imageAlt)}"
                             loading="lazy"
                             data-fallback="${fallbackImage}">
                    </div>
                    <div class="portfolio-details-text">
                        <div class="detail-row"><span class="detail-label" data-translate="detail_problem"></span><span class="detail-text">${escapeHtml(project.details[lang].problem)}</span></div>
                        <div class="detail-row"><span class="detail-label" data-translate="detail_solution"></span><span class="detail-text">${escapeHtml(project.details[lang].solution)}</span></div>
                        <div class="detail-row"><span class="detail-label" data-translate="detail_result"></span><span class="detail-text">${escapeHtml(project.details[lang].result)}</span></div>
                        <div class="detail-row"><span class="detail-label" data-translate="detail_scope"></span><span class="detail-text">${escapeHtml(project.details[lang].scope)}</span></div>
                    </div>
                </div>
                <div class="portfolio-footer">
                    <a href="${escapeHtml(project.link)}" class="portfolio-link" data-translate="project_details"></a>
                    <span class="portfolio-year">${escapeHtml(project.year)}</span>
                </div>
            </div>
        </div>`;
}

/**
 * Ð­ÐºÑÐ°Ð½Ð¸ÑÑÐµÑ HTML Ð´Ð»Ñ Ð±ÐµÐ·Ð¾Ð¿Ð°ÑÐ½Ð¾Ð¹ Ð²ÑÑÐ°Ð²ÐºÐ¸ Ð² ÑÐ°Ð·Ð¼ÐµÑÐºÑ.
 * @param {string} text
 * @returns {string}
 */
function normalizeSvgDataUrl(url) {
  if (typeof url !== 'string') return url;
  const prefix = 'data:image/svg+xml,';
  if (!url.startsWith(prefix)) return url;
  // If already encoded or has charset, keep
  if (url.startsWith('data:image/svg+xml;')) return url;
  const raw = url.slice(prefix.length);
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(raw);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

/**
 * ÐÐ±ÑÐ°Ð±Ð°ÑÑÐ²Ð°ÐµÑ Ð¾ÑÐ¸Ð±ÐºÐ¸ Ð·Ð°Ð³ÑÑÐ·ÐºÐ¸ Ð¸Ð·Ð¾Ð±ÑÐ°Ð¶ÐµÐ½Ð¸Ð¹
 */

function attachPortfolioToggles() {
  document.querySelectorAll('.portfolio-card').forEach(card => {
    const btn = card.querySelector('.portfolio-toggle');
    const details = card.querySelector('.portfolio-details');
    if (!btn || !details) return;

    function label(expanded) {
      if (window.currentLang === 'en') return expanded ? 'Hide' : 'Details';
      if (window.currentLang === 'ro') return expanded ? 'Ascunde' : 'Detalii';
      return expanded ? '\u0421\u043a\u0440\u044b\u0442\u044c' : '\u041f\u043e\u0434\u0440\u043e\u0431\u043d\u0435\u0435';
    }

    function toggle(force) {
      const expanded = typeof force === 'boolean' ? force : btn.getAttribute('aria-expanded') === 'true';
      const next = !expanded;
      btn.setAttribute('aria-expanded', next ? 'true' : 'false');
      btn.textContent = label(next);
      details.hidden = !next;
      card.classList.toggle('is-open', next);
    }

    btn.textContent = label(false);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggle();
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('.portfolio-link') || e.target.closest('.portfolio-toggle')) return;
      toggle();
    });
  });
}
function handleImageErrors() {
  document.querySelectorAll('.portfolio-image img').forEach(img => {
    img.addEventListener('error', function() {
      const fallback = this.getAttribute('data-fallback');
      if (fallback && this.src !== fallback) {
        this.src = fallback;
      }
    });
  });
}

/**
 * Ð ÐµÐ½Ð´ÐµÑÐ¸Ñ ÑÐµÐºÑÐ¸Ñ Ð¿Ð¾ÑÑÑÐ¾Ð»Ð¸Ð¾: Ð·Ð°Ð¿Ð¾Ð»Ð½ÑÐµÑ #portfolio-grid ÐºÐ°ÑÑÐ¾ÑÐºÐ°Ð¼Ð¸ Ð¸Ð· PORTFOLIO_PROJECTS.
 * ÐÐ¾ÑÐ»Ðµ Ð²ÑÑÐ°Ð²ÐºÐ¸ Ð²ÑÐ·ÑÐ²Ð°ÐµÑ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ Ð¿ÐµÑÐµÐ²Ð¾Ð´Ð¾Ð², ÐµÑÐ»Ð¸ Ð½Ð° ÑÑÑÐ°Ð½Ð¸ÑÐµ ÐµÑÑÑ ÑÑÐ½ÐºÑÐ¸Ñ applyTranslations.
 */
function renderPortfolio() {
  const container = document.getElementById('portfolio-grid');
  if (!container) {
    console.warn('Portfolio container not found');
    return;
  }

  try {
    container.innerHTML = PORTFOLIO_PROJECTS.map(createPortfolioCard).join('');
    
    // ÐÐ¾Ð±Ð°Ð²Ð»ÑÐµÐ¼ Ð¾Ð±ÑÐ°Ð±Ð¾ÑÐºÑ Ð¾ÑÐ¸Ð±Ð¾Ðº Ð¸Ð·Ð¾Ð±ÑÐ°Ð¶ÐµÐ½Ð¸Ð¹
    handleImageErrors();
    attachPortfolioToggles();
    
    // ÐÑÐ¸Ð¼ÐµÐ½ÑÐµÐ¼ Ð¿ÐµÑÐµÐ²Ð¾Ð´Ñ ÐµÑÐ»Ð¸ ÑÑÐ½ÐºÑÐ¸Ñ Ð´Ð¾ÑÑÑÐ¿Ð½Ð°
    if (typeof window.applyTranslations === 'function' && typeof window.currentLang !== 'undefined') {
      window.applyTranslations(window.currentLang);
    }
  } catch (error) {
    console.error('Error rendering portfolio:', error);
    container.innerHTML = '<p style="color: white; text-align: center;">Error loading portfolio</p>';
  }
}

// Ð ÐµÐ½Ð´ÐµÑ Ð¿ÑÐ¸ Ð·Ð°Ð³ÑÑÐ·ÐºÐµ DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPortfolio);
} else {
  renderPortfolio();
}

// Ð­ÐºÑÐ¿Ð¾ÑÑ Ð´Ð»Ñ Ð¸ÑÐ¿Ð¾Ð»ÑÐ·Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¸Ð· Ð¾ÑÐ½Ð¾Ð²Ð½Ð¾Ð³Ð¾ ÑÐºÑÐ¸Ð¿ÑÐ°
if (typeof window !== 'undefined') {
  window.PORTFOLIO_PROJECTS = PORTFOLIO_PROJECTS;
  window.renderPortfolio = renderPortfolio;
}










