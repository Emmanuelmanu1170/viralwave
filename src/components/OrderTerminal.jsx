import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ChevronDown, Zap, ShieldCheck, Info } from 'lucide-react';

export function OrderTerminal() {
  const [category, setCategory] = useState('TikTok');
  const [selectedService, setSelectedService] = useState(null);
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(1000);

  // --- FULL SERVICE DATABASE ---
  const servicesData = [
    // TikTok Views/Likes (Standard & Premium)
    { id: "27270", category: "TikTok", name: "Tiktok Views [Cancel Enabled] [Instant]", rateUSD: 0.0667 },
    { id: "27269", category: "TikTok", name: "Tiktok Views [Cancel Enabled] [Instant]", rateUSD: 0.0667 },
    { id: "27271", category: "TikTok", name: "Tiktok Views [Cancel Enabled] [Instant]", rateUSD: 0.0667 },
    { id: "27353", category: "TikTok", name: "TikTok - Likes | MQ 100K | Speed 89k P/D🔝 ⭐️⭐️⭐️", rateUSD: 0.0667 },
    { id: "19672", category: "TikTok", name: "TikTok - Likes | MQ 100K | Speed 80k P/D🔝 ⭐️⭐️⭐️", rateUSD: 0.0667 },
    { id: "18654", category: "TikTok", name: "TikTok - Likes | MQ 100K | Speed 50k P/D 🔥🔥🔝", rateUSD: 0.0667 },
    { id: "19325", category: "TikTok", name: "TikTok - Video Views | MQ 50M | Instant Start | Day 10M 🔥🔥🔝", rateUSD: 0.0667 },
    { id: "6056", category: "TikTok", name: "TikTok - Likes | MQ 1K | 0-1 Hours 🔥🔥🔝", rateUSD: 0.0667 },
    { id: "14888", category: "TikTok", name: "Tiktok - Likes | MQ 200K | 0-15 MIn | Instant 🔥🔥🔝", rateUSD: 0.0667 },
    { id: "18303", category: "TikTok", name: "TikTok - Likes | MQ 100K🔥🔥 🔝", rateUSD: 0.0667 },
    { id: "4919", category: "TikTok", name: "TikTok - Likes | MQ 1K | 0-3Hours🔥🔥🔝", rateUSD: 0.0667 },
    { id: "14566", category: "TikTok", name: "TikTok - Reposts | MQ 10K | HQ - Real | Always Working 🔥🔥🔝", rateUSD: 2.3273 },
    { id: "14090", category: "TikTok", name: "TikTok - Views | MQ 10K | HQ - Real | Always Working 🔥🔥🔝", rateUSD: 4.6540 },
    { id: "14091", category: "TikTok", name: "TikTok - Likes | MQ 10K | HQ - Real | Always Working 🔥🔥🔝", rateUSD: 3.4840 },
    { id: "2422", category: "TikTok", name: "TikTok - Followers | MQ 10K | HQ - Real | Always Working 🔥🔥🔝", rateUSD: 9.3080 },
    { id: "2425", category: "TikTok", name: "TikTok - Comments | Positive | MQ 50K | Recommended 🔥🔥🔝", rateUSD: 10.4780 },
    { id: "1812", category: "TikTok", name: "TikTok - Likes | MQ 100K | R30 | Recommended 🔥🔥 🔝", rateUSD: 1.95 },
    { id: "2524", category: "TikTok", name: "TikTok - Likes | MQ 50K | R30 | Recommended 🔥🔥🔝", rateUSD: 1.95 },
    { id: "2523", category: "TikTok", name: "TikTok - Followers | MQ 50K | R30 | Recommended🔥🔥🔝", rateUSD: 1.95 },
    { id: "1811", category: "TikTok", name: "TikTok - Followers | MQ 100K | R30 | Recommended 🔥🔥 🔝", rateUSD: 1.95 },
    { id: "19695", category: "TikTok", name: "TikTok - Shares | MQ 100K🔝", rateUSD: 0.1014 },
    { id: "19697", category: "TikTok", name: "TikTok - Save | MQ 100K 🔥🔥🔝", rateUSD: 0.1268 },
    { id: "24942", category: "TikTok", name: "TikTok - Followers | MQ 1M | 0-15 Min Start | 5K/Day", rateUSD: 1.69 },
    { id: "6485", category: "TikTok", name: "TikTok - Followers | MQ 100K | 0-30 Min 🔥🔥🔝", rateUSD: 0.6886 },
    { id: "14899", category: "TikTok", name: "Tiktok - Followers | MQ 500K | Speed 5-6K P/D | SuperInstant🔥🔥🔝", rateUSD: 0.7378 },
    { id: "24814", category: "TikTok", name: "TikTok - Followers | Worldwide | MQ 10M | 100% Real", rateUSD: 1.8759 },
    { id: "24812", category: "TikTok", name: "TikTok - Followers | MQ 10M | 100% Real | Drop 0-5%", rateUSD: 1.8421 },
    { id: "24823", category: "TikTok", name: "TikTok - Followers | MQ 1M | HQ Profiles | Cancel Enable", rateUSD: 1.7069 },
    { id: "11100", category: "TikTok", name: "Tiktok - Followers | MQ 200K | Speed 5-10K P/D", rateUSD: 2.1000 },
    { id: "22252", category: "TikTok", name: "TikTok - Followers | MQ 1M | HQ+Real | Cancel Enable", rateUSD: 2.0871 },
    { id: "14893", category: "TikTok", name: "Tiktok - Followers | MQ 150K🔥🔥🔝", rateUSD: 0.9836 },
    { id: "24787", category: "TikTok", name: "TikTok - Followers | Worldwide | MQ 1M | R30", rateUSD: 2.0280 },
    { id: "12843", category: "TikTok", name: "Tiktok - Followers | MQ 50K | SuperInstant", rateUSD: 2.0280 },
    { id: "25053", category: "TikTok", name: "TikTok - Followers | USA | MQ 100K | Non Drop | R30", rateUSD: 3.0420 },
    { id: "22422", category: "TikTok", name: "TikTok - Followers | MQ 10M | MQ Profiles | Non Drop", rateUSD: 2.6796 },
    { id: "21862", category: "TikTok", name: "TikTok - Followers | MQ 1M | HQ+ Real | R30", rateUSD: 2.2629 },
    { id: "21861", category: "TikTok", name: "TikTok - Followers | MQ 1M | Non Drop | R30", rateUSD: 2.1641 },
    { id: "17299", category: "TikTok", name: "TikTok - Followers | MQ 300K | Real Global Users", rateUSD: 2.5839 },
    { id: "10135", category: "TikTok", name: "TikTok - Followers | MQ 100K | Real | Non Drop", rateUSD: 2.7885 },
    { id: "27901", category: "TikTok", name: "TikTok Followers [New Base] [Non Drop] [Lifetime Refill] ✅", rateUSD: 2.7040 },
    { id: "27900", category: "TikTok", name: "TikTok Followers [Non Drop] [5K/Day] [Lifetime Refill] ✅", rateUSD: 2.0280 },
    { id: "16496", category: "TikTok", name: "TikTok - Likes | MQ 50K | Speed 1-2K P/D | 🔥🔥🔝", rateUSD: 0.1333 },
    { id: "3240", category: "TikTok", name: "TikTok - Likes | MQ 5K | 0-1Hours 🔥🔥🔝", rateUSD: 0.1000 },
    { id: "14424", category: "TikTok", name: "Tiktok - Likes | MQ 30K | 0-15 Min 🔥🔥🔝", rateUSD: 0.1133 },
    { id: "6474", category: "TikTok", name: "TikTok - Likes | MQ 100K | 0-1 Hours 🔥🔥🔝", rateUSD: 0.1022 },
    { id: "24738", category: "TikTok", name: "TikTok - Likes | MQ 10M | HQ & Real | Lifetime", rateUSD: 0.1098 },
    { id: "17882", category: "TikTok", name: "TikTok - Video Views | MQ 100M | Instant 🔥🔥 🔝", rateUSD: 0.0799 },
    { id: "19085", category: "TikTok", name: "TikTok - Video Views | MQ 100M | Speed 1M/Day 🔥🔥🔝", rateUSD: 0.0794 },
    { id: "15155", category: "TikTok", name: "TikTok - Views | MQ 100M 🔥🔥🔝", rateUSD: 0.0674 },
    { id: "19200", category: "TikTok", name: "Tiktok - Views | MQ 2.1B | Super Fast 🔥🔥🔝", rateUSD: 0.0785 },
    { id: "18323", category: "TikTok", name: "TikTok - Views | MQ 10M | Instant 🔥🔥 🔝", rateUSD: 0.0784 },
    { id: "17366", category: "TikTok", name: "Tiktok - Share | MQ 1M | Speed 10K P/D 🔥🔥🔝", rateUSD: 0.1538 },
    { id: "24623", category: "TikTok", name: "TikTok - Video Share | MQ 10M | R30", rateUSD: 0.1318 },
    { id: "22017", category: "TikTok", name: "TikTok - Livestream Views | Instant | Stay: 30 min🔝", rateUSD: 0.7771 },
    { id: "18217", category: "TikTok", name: "Tiktok - Live | Broadcast Views | 15 Minutes 🔥🔥🔝", rateUSD: 0.7250 },
    { id: "22031", category: "TikTok", name: "TikTok - Live Stream Views | 15 Minutes🔝", rateUSD: 0.5720 },
    { id: "22016", category: "TikTok", name: "TikTok - Livestream Views | Stay: 15 min🔝", rateUSD: 0.3886 },
    { id: "22885", category: "TikTok", name: "Tiktok - Live Stream | PK Battle Points [ 500K ]🔝", rateUSD: 0.2113 },
    { id: "19797", category: "TikTok", name: "TikTok - Live Stream Views | 180 Minutes 🔝", rateUSD: 6.7271 },
    { id: "19795", category: "TikTok", name: "TikTok - Live Stream Views | 90 Minutes 🔝", rateUSD: 3.3716 },
    { id: "19794", category: "TikTok", name: "TikTok - Live Stream Views | 60 Minutes🔝", rateUSD: 2.2477 },
    { id: "19793", category: "TikTok", name: "TikTok - Live Stream Views | 30 Minutes 🔝", rateUSD: 1.1238 },
    { id: "19792", category: "TikTok", name: "TikTok - Live Stream Views | 15 Minutes 🔝", rateUSD: 0.5620 },
    { id: "19851", category: "TikTok", name: "Tiktok - Comments | MQ 1K | 3 Comments | Real Humans 🔝", rateUSD: 0.2028 },
    { id: "19856", category: "TikTok", name: "Tiktok - Comments | MQ 1K | 3 Comments | Any Quality", rateUSD: 0.1014 },
    { id: "20139", category: "TikTok", name: "Tiktok - Live Likes | MQ 100M | Speed 500K P/D 🔥🔥🔝", rateUSD: 0.1174 },
    { id: "23689", category: "TikTok", name: "Tiktok - Live Likes | MQ 100M | Speed: 500K/Day🔝", rateUSD: 0.1005 },
    { id: "23886", category: "TikTok", name: "TikTok - Live Chat Comments | Brazil | Custom", rateUSD: 1.6900 },
    { id: "19852", category: "TikTok", name: "TikTok - Comments | 6 Comments | Real Humans 🔝", rateUSD: 0.3549 },
    { id: "25148", category: "TikTok", name: "TikTok - Followers | MQ 1M | 100% Real & Active", rateUSD: 2.2815 },

    // Instagram
    { id: "2432", category: "Instagram", name: "Instagram - Likes | MQ 10K | HQ - Real | Always Working 🔥🔥🔝⭐️⭐️⭐️", rateUSD: 4.6927 },
    { id: "2544", category: "Instagram", name: "Instagram - Comments | MQ 10K | HQ - Real | Always Working 🔥🔥🔝", rateUSD: 13.0000 },
    { id: "2431", category: "Instagram", name: "Instagram - Followers | MQ 30K | HQ | RB30🔝", rateUSD: 11.7000 },
    { id: "27989", category: "Instagram", name: "Instagram Likes [ Max 1M ] | Lifetime ♻️ | Instant Start", rateUSD: 0.2620 },
    { id: "27988", category: "Instagram", name: "Instagram Likes [ Max 1M ] | 365 Days ♻️ | Instant Start", rateUSD: 0.2535 },
    { id: "27987", category: "Instagram", name: "Instagram Likes [ Max 1M ] | 90 Days ♻️ | Instant Start", rateUSD: 0.2451 },
    { id: "27986", category: "Instagram", name: "Instagram Likes [ Max 1M ] | 60 Days ♻️ | Instant Start", rateUSD: 0.2366 },
    { id: "27985", category: "Instagram", name: "Instagram Likes [ Max 1M ] | 30 Days ♻️ | Instant Start", rateUSD: 0.2282 },
    { id: "27274", category: "Instagram", name: "Instagram Likes [High Quality] [No Drop] [60 Days Refill]", rateUSD: 0.3570 },
    { id: "27279", category: "Instagram", name: "Instagram Likes [Real] [30 Days Refill] [Instant]", rateUSD: 0.1947 },
    { id: "27273", category: "Instagram", name: "Instagram Likes [High Quality] [No Drop] [30 Days Refill]", rateUSD: 0.3407 },
    { id: "27278", category: "Instagram", name: "Instagram Likes [Real] [No Refill] [Instant]", rateUSD: 0.1785 },
    { id: "27272", category: "Instagram", name: "Instagram Likes [High Quality] [No Drop] [Instant]", rateUSD: 0.3245 },
    { id: "27288", category: "Instagram", name: "Instagram Followers [High Quality+ Real] [365 Days Refill]", rateUSD: 4.0560 },
    { id: "27287", category: "Instagram", name: "Instagram Followers [High Quality+ Real] [90 Days Refill]", rateUSD: 3.4070 },
    { id: "27286", category: "Instagram", name: "Instagram Followers [High Quality+ Real] [60 Days Refill]", rateUSD: 2.9203 },
    { id: "27285", category: "Instagram", name: "Instagram Followers [High Quality+ Real] [30 Days Refill]", rateUSD: 2.4336 },
    { id: "27284", category: "Instagram", name: "Instagram Followers [High Quality+ Real] [No Refill]", rateUSD: 1.9469 },
    { id: "19882", category: "Instagram", name: "Instagram - Likes | First World Countries | MQ 10K", rateUSD: 2.7040 },
    { id: "19883", category: "Instagram", name: "Instagram - Likes | USA | MQ 15K | Real | Instant 🔝", rateUSD: 5.2390 },
    { id: "110", category: "Instagram", name: "Instagram - Likes | Real | MQ 50K🔝", rateUSD: 0.4914 },
    { id: "19919", category: "Instagram", name: "Instagram - Likes | India | MQ 10K | Real | Instant", rateUSD: 1.8590 },
    { id: "15267", category: "Instagram", name: "Instagram - Followers | Latin America | AR30 🔥🔥🔝", rateUSD: 6.3518 },
    { id: "16344", category: "Instagram", name: "Instagram - Followers | MQ 50K | Indian Mixed 🔥🔥🔝", rateUSD: 3.1096 },
    { id: "16343", category: "Instagram", name: "Instagram - Followers | MQ 10K | Real Mixed 🔥🔥🔝", rateUSD: 5.1308 },
    { id: "20695", category: "Instagram", name: "Instagram - Followers | MQ 100K | Speed 30-40k/day🔝", rateUSD: 2.6195 },
    { id: "17661", category: "Instagram", name: "Instagram - Story Views | MQ 10K | HQ | Speed 10K P/D", rateUSD: 0.1704 },
    { id: "10570", category: "Instagram", name: "Instagram - Story Views | All Story | No Drop 🔥🔥🔝", rateUSD: 0.0667 },
    { id: "17649", category: "Instagram", name: "Instagram - Story Views | MQ 30K 🔥🔥🔝", rateUSD: 0.1083 },
    { id: "19198", category: "Instagram", name: "Instagram - Views | MQ 2.1B | Top Selling 🔥🔥🔝", rateUSD: 0.0667 },
    { id: "19197", category: "Instagram", name: "Instagram - Views | MQ 10M | All link work 🔝", rateUSD: 0.0836 },
    { id: "18431", category: "Instagram", name: "Instagram - Saves | MQ 50K | Instant 🔥🔥🔝", rateUSD: 0.0930 },
    { id: "6775", category: "Instagram", name: "Instagram - Saves | MQ 15K | Super Fast | Real 🔥🔥🔝", rateUSD: 0.0751 },
    { id: "18030", category: "Instagram", name: "Instagram - Save | MQ 200K | Alway Working 🔥🔥🔝", rateUSD: 0.0713 },
    { id: "3359", category: "Instagram", name: "Instagram - Profile Visits | MQ 5M | Real HQ 🔥🔥🔝", rateUSD: 0.1217 },
    { id: "9090", category: "Instagram", name: "Instagram - Profile Visit | MQ 100K 🔥🔥🔝", rateUSD: 0.1055 },
    { id: "21890", category: "Instagram", name: "Instagram - Shares | MQ 1M | Start Time: Instant", rateUSD: 0.1265 },
    { id: "23928", category: "Instagram", name: "Instagram - Share | MQ 10M | Instant | Super Fast", rateUSD: 0.0971 },
    { id: "16455", category: "Instagram", name: "Instagram - Reels Views | MQ 200K | Fast 🔥🔥🔝", rateUSD: 0.0703 },
    { id: "9081", category: "Instagram", name: "Instagram - Reel Views | MQ 500K | Slow 🔥🔥🔝", rateUSD: 0.0966 },
    { id: "16451", category: "Instagram", name: "Instagram - Reels Views | MQ 500K | Slow 🔥🔥🔝", rateUSD: 0.0810 },
    { id: "10771", category: "Instagram", name: "Instagram - Reach and Impressions | MQ 500K 🔥🔥🔝", rateUSD: 0.0728 },
    { id: "17629", category: "Instagram", name: "Instagram - Reach + Impressions + Profile Visits 🔥🔥🔝", rateUSD: 0.0727 },
    { id: "17630", category: "Instagram", name: "Instagram - Reach + Impressions + Profile Visits [1M]", rateUSD: 0.1317 },
    { id: "3358", category: "Instagram", name: "Instagram - Impressions | MQ 5M 🔥🔥🔝", rateUSD: 0.1275 },
    { id: "23516", category: "Instagram", name: "Instagram - Emoji Comments | HQ Profiles | Cancel Enable", rateUSD: 5.0700 },
    { id: "23515", category: "Instagram", name: "Instagram - Custom Comments | HQ Profiles | Cancel Enable", rateUSD: 5.0700 },
    { id: "15663", category: "Instagram", name: "Instagram - Comments | 5 Comments | Random | Emojis", rateUSD: 0.2113 },
    { id: "15662", category: "Instagram", name: "Instagram - Comments | 3 Comments | Random | Emojis", rateUSD: 0.1268 },
    { id: "17671", category: "Instagram", name: "Instagram - Story Impressions | MQ 100K | Instant", rateUSD: 0.5008 },
    { id: "16544", category: "Instagram", name: "Instagram - Auto Likes | MQ 5M |🔥🔥🔝", rateUSD: 0.6760 },
    { id: "22082", category: "Instagram", name: "Instagram - Comment Likes | MQ 30K", rateUSD: 25.3500 },
    { id: "22083", category: "Instagram", name: "Instagram - Comment Likes | MQ 30K | Comment Link", rateUSD: 25.3500 },
    { id: "25064", category: "Instagram", name: "Instagram - Followers | MQ 500K | Old Accounts | Low Drop", rateUSD: 0.9971 },

    // YouTube
    { id: "27360", category: "YouTube", name: "Youtube Live Stream Views [120 Minutes]", rateUSD: 0.4544 },
    { id: "27359", category: "YouTube", name: "Youtube Live Stream Views [90 Minutes]", rateUSD: 0.3407 },
    { id: "27358", category: "YouTube", name: "Youtube Live Stream Views [60 Minutes]", rateUSD: 0.2272 },
    { id: "27357", category: "YouTube", name: "Youtube Live Stream Views [30 Minutes]", rateUSD: 0.1753 },
    { id: "27356", category: "YouTube", name: "Youtube Live Stream Views [15 Minutes]", rateUSD: 0.1211 },
    { id: "20202", category: "YouTube", name: "Youtube - Views | 100% Non drop | Lifetime guaranteed", rateUSD: 1.1830 },
    { id: "20153", category: "YouTube", name: "Youtube - Views | MQ 200M | LifeTime Guarantee | RB30", rateUSD: 1.4365 },
    { id: "9221", category: "YouTube", name: "YouTube - Views | MQ 700K | Lifetime Warranty 🔥🔥🔝", rateUSD: 1.3858 },
    { id: "24978", category: "YouTube", name: "YouTube - Views | RB30 | Non Drop | 120 sec 🔥🔥🔝", rateUSD: 4.1860 },
    { id: "24977", category: "YouTube", name: "YouTube - Views | RB30 | Non Drop | 90 sec 🔥🔥🔝", rateUSD: 3.1590 },
    { id: "18467", category: "YouTube", name: "Youtube - Likes | 0-15 Min | Speed: 50K/Day 🔥🔥🔝", rateUSD: 0.1690 },
    { id: "18704", category: "YouTube", name: "Youtube - Dislikes | MQ 500K | Super Fast 🔥🔥🔝", rateUSD: 0.1690 },
    { id: "24131", category: "YouTube", name: "Youtube - Likes | Start: 0-15 Min | No Warranty", rateUSD: 0.1521 },
    { id: "18400", category: "YouTube", name: "Youtube - Likes | MQ 100K | Speed 20K/Day 🔥🔥🔝", rateUSD: 0.1470 },
    { id: "22709", category: "YouTube", name: "Youtube - Likes | Start Time: 0-15 Min | Day 50K🔝", rateUSD: 0.1183 },
    { id: "17865", category: "YouTube", name: "Youtube - Subscribe | MQ 50K | Instant Superfast 🔥🔥🔝", rateUSD: 4.1405 },
    { id: "4763", category: "YouTube", name: "Youtube - Subscribes | MQ 10K | 0-15 Min🔥🔥🔝", rateUSD: 4.9179 },
    { id: "23991", category: "YouTube", name: "Youtube - Likes | MQ 500K | Speed: 20K/Day | R60", rateUSD: 0.2366 },
    { id: "23312", category: "YouTube", name: "Youtube - Subscribers | Speed: 400/Day | Non Drop | R90", rateUSD: 17.6436 },
    { id: "10242", category: "YouTube", name: "Youtube - Community Post Likes | Non Drop | RB30 🔥🔥🔝", rateUSD: 1.3858 },
    { id: "20616", category: "YouTube", name: "Youtube - Comments Likes | Up Vote | Instant", rateUSD: 1.4703 },
    { id: "27905", category: "YouTube", name: "YouTube Subscribers [👤 Real] [Non Drop] [Lifetime] ✅", rateUSD: 58.9810 },
    { id: "13227", category: "YouTube", name: "YouTube - Short Views | Speed 2-3K P/D | Life time 🔥🔥🔝", rateUSD: 1.2979 },
    { id: "20478", category: "YouTube", name: "Youtube - Short Views | Non Drop | Lifetime Guaranteed", rateUSD: 1.5041 },
    { id: "19626", category: "YouTube", name: "YouTube - GEO Likes |Thailand | Lifetime Refill 🔝", rateUSD: 0.6084 },
    { id: "19372", category: "YouTube", name: "YouTube - Live Stream Likes | Real | Non Drop | R30", rateUSD: 0.5408 },
    { id: "27928", category: "YouTube", name: "YouTube Subscribers [Non Drop] [30 Days Refill] ⭐", rateUSD: 40.3910 },
    { id: "27904", category: "YouTube", name: "Youtube WatchTime [60+ Mins Video] [30 Days Refill] ✅", rateUSD: 45.6131 },
    { id: "27903", category: "YouTube", name: "Youtube WatchTime [30+ Mins Video] [30 Days Refill] ✅", rateUSD: 31.9410 },
    { id: "21882", category: "YouTube", name: "YouTube - Watch Hours | 5+ Mins Video | Lifetime", rateUSD: 9.8020 },

    // Telegram
    { id: "24847", category: "Telegram", name: "Telegram - Members | High Quality | Non Drop | R120", rateUSD: 1.5041 },
    { id: "12274", category: "Telegram", name: "Telegram - Channel/Group Members | Non Drop 🔥🔥🔝", rateUSD: 1.5253 },
    { id: "21021", category: "Telegram", name: "Telegram - Members | 60 Days Non Drop | SuperFast", rateUSD: 1.8675 },
    { id: "21022", category: "Telegram", name: "Telegram - Members | 90 Days Non Drop | SuperFast", rateUSD: 2.0872 },
    { id: "19081", category: "Telegram", name: "Telegram - Premium Members + Views | 20-30 Days 🔥🔥🔝", rateUSD: 11.9990 },
    { id: "18141", category: "Telegram", name: "Telegram - Auto View From Search | Indian | Real 🔥🔥🔝", rateUSD: 0.0803 },
    { id: "13134", category: "Telegram", name: "Telegram - Post Views | Last 10 Posts 🔥🔥🔝", rateUSD: 0.1067 },
    { id: "18795", category: "Telegram", name: "Telegram - Views + Stats | Russian | MQ 100K 🔥🔥🔝", rateUSD: 0.1581 },
    { id: "5976", category: "Telegram", name: "Telegram - Post Views | Last 5 Post 🔥🔥🔝", rateUSD: 0.1859 },
    { id: "21031", category: "Telegram", name: "Telegram - Post View | Last 50 Post | Best", rateUSD: 0.5329 },
    { id: "16144", category: "Telegram", name: "Telegram - Positive reactions(👍🤩🎉🔥🧡) 🔥🔥 🔝", rateUSD: 0.3289 },
    { id: "16145", category: "Telegram", name: "Telegram - Negative reactions(👎💩🤮😢😱) 🔥🔥🔝", rateUSD: 0.3289 },
    { id: "16152", category: "Telegram", name: "Telegram - Reactions - 🎉| MQ 100K🔥🔥🔝", rateUSD: 0.3289 },
    { id: "16154", category: "Telegram", name: "Telegram - Reactions - 🤩| MQ 100K🔥🔥 🔝", rateUSD: 0.3289 },
    { id: "19003", category: "Telegram", name: "Telegram - Positive Reactions | Speed 2K P/D🔝", rateUSD: 0.3166 },
    { id: "27942", category: "Telegram", name: "Telegram Members [Zero Drop] [365 Days Refill] ⭐", rateUSD: 1.5548 },
    { id: "27937", category: "Telegram", name: "Telegram Members [Good Quality] [180 Days Refill] 📌", rateUSD: 1.5041 },
    { id: "27938", category: "Telegram", name: "Telegram Members [Good Quality] [270 Days Refill] 📌", rateUSD: 1.8590 },
    { id: "13291", category: "Telegram", name: "Telegram - Post Vote/Poll | MQ 300K | Instant 🔥🔥🔝", rateUSD: 0.4407 },
    { id: "15594", category: "Telegram", name: "Telegram - Share Post - Include Static | India 🔥🔥🔝", rateUSD: 0.0788 },

    // Facebook
    { id: "28012", category: "Facebook", name: "[ WC ] - Facebook Live Stream Viewers [ 90 Minutes ]", rateUSD: 0.28 },
    { id: "28011", category: "Facebook", name: "[ WC ] - Facebook Live Stream Viewers [ 60 Minutes ]", rateUSD: 0.19 },
    { id: "28014", category: "Facebook", name: "[ WC ] - Facebook Live Stream Viewers [ 150 Minutes ]", rateUSD: 0.47 },
    { id: "28016", category: "Facebook", name: "[ WC ] - Facebook Live Stream Viewers [ 360 Minutes ]", rateUSD: 1.12 },
    { id: "28017", category: "Facebook", name: "[ WC ] - Facebook Live Stream Viewers [ 480 Minutes ]", rateUSD: 1.49 },
    { id: "27997", category: "Facebook", name: "Facebook Super Instant Real Care React (R30)", rateUSD: 2.21 },
    { id: "27993", category: "Facebook", name: "Facebook Super Instant Real Angry React (R30)", rateUSD: 2.21 },
    { id: "27992", category: "Facebook", name: "Facebook Super Instant Real Hearts/Love (R30)", rateUSD: 2.21 },
    { id: "27991", category: "Facebook", name: "Facebook Super Instant Real Post Likes (R30)", rateUSD: 2.21 },
    { id: "27998", category: "Facebook", name: "FB Page Followers ONLY (Non Drop) (R30)", rateUSD: 4.91 },
    { id: "27994", category: "Facebook", name: "Facebook Super Instant Real Haha React (R30)", rateUSD: 2.21 },
    { id: "16611", category: "Facebook", name: "Facebook - Video/Reel Views | Monetizable", rateUSD: 0.29 },
    { id: "15613", category: "Facebook", name: "Facebook - Page Likes+Followers | Lifetime", rateUSD: 1.96 },
    { id: "10036", category: "Facebook", name: "Facebook - Page Likes+Followers | Non Drop", rateUSD: 2.45 },
    { id: "27999", category: "Facebook", name: "FB Profile Followers ONLY (Non Drop) (R30)", rateUSD: 4.58 },
    { id: "6792", category: "Facebook", name: "Facebook - Post Likes | Non Drop | HQ | Real", rateUSD: 6.38 },
    { id: "3052", category: "Facebook", name: "Facebook - Post/Photo Likes | Instant | No Drop", rateUSD: 6.79 },
    { id: "6321", category: "Facebook", name: "Facebook - Post Likes | 100% Non Drop | Real", rateUSD: 7.03 },
    { id: "16612", category: "Facebook", name: "Facebook - Video/Reel Views | 3 Seconds | SV3", rateUSD: 0.20 },
    { id: "16916", category: "Facebook", name: "Facebook - Live Stream Views | Stay for 15 min", rateUSD: 1.44 },
    { id: "24050", category: "Facebook", name: "Facebook - Live Stream Views | 60 Minutes", rateUSD: 2.88 },
    { id: "23010", category: "Facebook", name: "Facebook - Live Stream Views | 180 Minutes", rateUSD: 12.95 },
    { id: "21930", category: "Facebook", name: "Facebook Live - Organic Viewers | 180 Minutes", rateUSD: 15.66 },
    { id: "20120", category: "Facebook", name: "Facebook - Live Stream | Stay 180 Min | Instant", rateUSD: 16.39 },
    { id: "27214", category: "Facebook", name: "Facebook Post Reaction 😡 | Instant Start", rateUSD: 0.62 },
    { id: "10377", category: "Facebook", name: "Facebook - Photo Likes | Real Likes | RB30", rateUSD: 7.36 },
    { id: "14956", category: "Facebook", name: "Facebook - Followers | MQ 500K | 0-30 Minutes", rateUSD: 1.95 },
    { id: "24892", category: "Facebook", name: "Facebook - Page Likes + Followers | R30", rateUSD: 3.68 },
    { id: "20127", category: "Facebook", name: "Facebook - Post Reactions | Care | R30", rateUSD: 2.26 },

    // Twitter
    { id: "20902", category: "Twitter", name: "Twitter - Organic Impressions | Bundle | New", rateUSD: 0.36 },
    { id: "10714", category: "Twitter", name: "Twitter - Impression | Speed 1M P/H | R45", rateUSD: 0.10 },
    { id: "18041", category: "Twitter", name: "Twitter - Impressions | MQ 2.1B | Unlimited", rateUSD: 0.10 },
    { id: "18032", category: "Twitter", name: "Twitter - Bundle Impression (Views-Clicks)", rateUSD: 0.09 },
    { id: "14720", category: "Twitter", name: "Twitter - Views | Instant Start | Speed 1M/D", rateUSD: 0.07 },
    { id: "20894", category: "Twitter", name: "Twitter - Views | USA | MQ 5M", rateUSD: 0.09 },
    { id: "17427", category: "Twitter", name: "Twitter - Tweet Views | MQ 2.1B", rateUSD: 0.10 },
    { id: "20901", category: "Twitter", name: "Twitter - Organic Views | Speed 100k P/H", rateUSD: 0.10 },
  ];

  // --- AUTOMATIC ARRANGEMENT LOGIC ---
  const categories = [...new Set(servicesData.map((s) => s.category))];

  const filteredServices = useMemo(() => {
    return servicesData
      .filter((s) => {
        const matchCat = s.category === category;
        const nameLower = s.name.toLowerCase();
        const isFollower = nameLower.includes("follower") || nameLower.includes("subscribe") || nameLower.includes("member");
        const isViewOrLike = nameLower.includes("view") || nameLower.includes("like");

        // Logic Filter: Views/Likes must be > $0.1
        if (isViewOrLike && !isFollower && s.rateUSD <= 0.1) return false;
        
        return matchCat;
      })
      .sort((a, b) => {
        // Sort Recommended (>= $1.5) to the TOP
        const aRec = a.rateUSD >= 1.5 ? 1 : 0;
        const bRec = b.rateUSD >= 1.5 ? 1 : 0;
        return bRec - aRec;
      });
  }, [category]);

  const totalCost = useMemo(() => {
    if (!selectedService) return "0.00";
    return ((selectedService.rateUSD / 1000) * quantity).toFixed(3);
  }, [selectedService, quantity]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border p-1"
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20">
              <ShoppingCart className="text-[#00D9FF] w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Order Terminal</h2>
              <p className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-[0.3em]">Protocol // Fulfillment</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Network Protocol</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setSelectedService(null);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                      category === cat
                        ? "bg-[#00D9FF] text-[#0b0e14] shadow-[0_0_20px_rgba(0,217,255,0.4)]"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Service Package</label>
              <div className="relative">
                <select
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold text-white outline-none appearance-none focus:border-[#00D9FF] transition-all cursor-pointer"
                  onChange={(e) => setSelectedService(filteredServices.find((s) => s.id === e.target.value))}
                  value={selectedService?.id || ""}
                >
                  <option value="" disabled>Initialize Service Selection...</option>
                  {filteredServices.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0f1419]">
                      {s.rateUSD >= 1.5 ? "⭐ RECOMMENDED: " : ""}{s.name} — (${s.rateUSD}/1k)
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-500 pointer-events-none w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Target Link</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-xs font-mono text-white outline-none focus:border-[#00D9FF] transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-black text-[#00D9FF] outline-none focus:border-[#00D9FF] transition-all"
                />
              </div>
            </div>

            <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-6 relative overflow-hidden">
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500/60">Estimated Charge</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black italic text-white tracking-tighter">${totalCost}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">USD</span>
                  </div>
                </div>
                <div className="text-right">
                  <ShieldCheck className="w-5 h-5 text-cyan-500/30 ml-auto mb-1" />
                  <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Protocol Secured</p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 217, 255, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-[#00D9FF] text-[#0b0e14] font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl cursor-pointer flex items-center justify-center gap-3"
            >
              <Zap size={16} fill="currentColor" />
              Deploy Growth Order
            </motion.button>
          </div>
        </div>
      </div>

      <div className="px-8 py-4 bg-white/5 border-t border-white/5 flex items-center gap-3">
        <Info size={14} className="text-cyan-500" />
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
          Average Delivery Time: <span className="text-white">5 - 45 Minutes</span> • 24/7 Node Support Active
        </p>
      </div>
    </motion.div>
  );
}