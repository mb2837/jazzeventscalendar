import type { JazzEvent, OngoingSeries } from '../types';

/** Parsed from “Aug. 2026 jazz events # 3”. Obvious July→August typos corrected. */
export const events: JazzEvent[] = [
  // Aug 6
  { id: 'e0806-1', date: '2026-08-06', startTime: '18:00', endTime: '21:30', artist: 'Leon Ziligson', venueId: 'dakotas' },
  { id: 'e0806-2', date: '2026-08-06', startTime: '18:30', endTime: '22:00', artist: 'Erik Barnes / Jeff Robbins Duo', venueId: 'library-bar' },
  { id: 'e0806-3', date: '2026-08-06', startTime: '19:00', endTime: '22:00', artist: 'Linny Nance & Network', venueId: 'free-man', cover: '$10 cover' },
  { id: 'e0806-4', date: '2026-08-06', startTime: '19:00', endTime: '23:00', artist: 'Bishop Avenue Hot 6', venueId: 'revelers', cover: '$6 cover', notes: "Roaring 20's and 30's traditional jazz" },
  { id: 'e0806-5', date: '2026-08-06', startTime: '19:30', artist: 'Brian Piper Trio', venueId: 'kitchen', cover: '$20 cover', musicians: 'Brian Warthen – bass, Steve Barnes – drums' },
  { id: 'e0806-6', date: '2026-08-06', startTime: '20:00', endTime: '23:00', artist: 'The John Adams Group – Soul Jazz Tribute', venueId: 'scat', notes: 'Music of Horace Silver, Jazz Crusaders, Les McCann, Grover Washington & more', musicians: 'John Adams – bass, Stefan Karlsson – piano, Jason Smith – drums, Matthew Babineaux – sax/keys/vocals', ticketUrl: 'http://scatjazzlounge.com' },

  // Aug 7
  { id: 'e0807-1', date: '2026-08-07', startTime: '19:30', artist: 'Tony Hakim Band', venueId: 'kitchen', cover: '$20 cover', notes: "Jazz, pop, blues – 60's and 70's" },
  { id: 'e0807-2', date: '2026-08-07', startTime: '20:00', endTime: '22:00', artist: 'Bobby Falk Quartet', venueId: 'stoneys', notes: 'Ticketed event', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0807-3', date: '2026-08-07', startTime: '18:00', endTime: '20:00', artist: 'Kay and Kent Ellingson', venueId: 'wine-therapist', cover: 'No cover', musicians: 'Mark Wilson – bass, Fred Gleber – drums' },
  { id: 'e0807-4', date: '2026-08-07', startTime: '20:00', artist: 'Shelley Carrol', venueId: 'scat', notes: 'Ticketed event', ticketUrl: 'https://scatjazzlounge.com' },
  { id: 'e0807-5', date: '2026-08-07', startTime: '19:00', endTime: '22:00', artist: "Joel Pipkin's World Jazz Project", venueId: 'resident', cover: 'No cover', notes: 'Flamenco, Afro-Cuban, Brazilian, Gypsy Jazz, Be-Bop & Beatles. Reservations: (972) 685-5280', musicians: 'Joel Pipkin, Chris Hamilton, Nick Jones, Alfredo Gonzales' },

  // Aug 8
  { id: 'e0808-1', date: '2026-08-08', startTime: '18:00', endTime: '21:00', artist: 'Deanna Self', venueId: 'central-market-southlake', musicians: 'Mike Garvey – piano, Evan Tom – bass' },
  { id: 'e0808-2', date: '2026-08-08', startTime: '18:00', endTime: '21:30', artist: 'Leon Ziligson', venueId: 'dakotas' },
  { id: 'e0808-3', date: '2026-08-08', startTime: '14:00', endTime: '17:00', artist: "Reveler's Hall Band", venueId: 'revelers' },
  { id: 'e0808-4', date: '2026-08-08', startTime: '19:30', artist: 'Tony Hakim Band', venueId: 'kitchen', cover: '$20 cover', notes: "Jazz, pop, blues – 60's and 70's" },
  { id: 'e0808-5', date: '2026-08-08', startTime: '20:00', artist: 'Bishop Ave. Hot Six', venueId: 'scat', notes: 'Ticketed event', ticketUrl: 'https://scatjazzlounge.com' },
  { id: 'e0808-6', date: '2026-08-08', startTime: '20:00', endTime: '22:00', artist: 'Chad Stockslager', venueId: 'stoneys', notes: 'Tickets', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0808-7', date: '2026-08-08', startTime: '21:00', endTime: '23:00', artist: 'Nathalie Gauthe Wasser Jazz Trio', venueId: 'wine-therapist', musicians: 'Nathalie – vocals, Rowan Barcham – piano, Brian Warthan – bass, Ted Wasser – drums' },

  // Aug 9
  { id: 'e0809-1', date: '2026-08-09', startTime: '12:00', endTime: '15:00', artist: 'Kim Platko / Jason Jones', venueId: 'nova-cafe', notes: 'Guitar duo' },
  { id: 'e0809-2', date: '2026-08-09', startTime: '18:00', artist: 'Brian Piper and Friends', venueId: 'grace-bible', notes: 'Jazz concert', musicians: 'Steve Barnes, Brian Warthen, Chris McGuire' },
  { id: 'e0809-3', date: '2026-08-09', startTime: '14:00', endTime: '17:00', artist: "Reveler's Hall Band", venueId: 'revelers' },
  { id: 'e0809-4', date: '2026-08-09', startTime: '20:00', endTime: '23:00', artist: 'The Fisher Quartet – A Listening Experience', venueId: 'balcony', cover: 'No cover', musicians: 'Shelley Carrol, Andrew Griffith, Peter Rioux / Stefan Karlsson, Jonathan Fisher' },
  { id: 'e0809-5', date: '2026-08-09', startTime: '20:00', artist: 'Black Dog Jam', venueId: 'scat', notes: 'Ticketed event', ticketUrl: 'https://scatjazzlounge.com' },
  { id: 'e0809-6', date: '2026-08-09', startTime: '19:00', endTime: '21:00', artist: 'Dallas Jazz Orchestra', venueId: 'rodeo-city' },

  // Aug 10
  { id: 'e0810-1', date: '2026-08-10', startTime: '18:00', endTime: '21:30', artist: 'Leon Ziligson', venueId: 'dakotas' },
  { id: 'e0810-2', date: '2026-08-10', startTime: '20:00', endTime: '23:00', artist: 'Red Beans and Rice with Terrance Bradford', venueId: 'revelers', cover: '$6 cover' },

  // Aug 11
  { id: 'e0811-1', date: '2026-08-11', startTime: '16:00', endTime: '18:00', artist: 'Paul Metzger – Happy Hour', venueId: 'steves' },
  { id: 'e0811-2', date: '2026-08-11', startTime: '18:00', endTime: '21:30', artist: 'Leon Ziligson', venueId: 'dakotas' },
  { id: 'e0811-3', date: '2026-08-11', startTime: '19:00', endTime: '23:00', artist: 'Todd Blalock and The Terraplane Rounders', venueId: 'revelers' },

  // Aug 12
  { id: 'e0812-1', date: '2026-08-12', startTime: '16:00', endTime: '18:00', artist: 'Kelly Durbin – Happy Hour', venueId: 'steves' },
  { id: 'e0812-2', date: '2026-08-12', startTime: '19:30', endTime: '22:00', artist: 'Lynn Cadena Solo', venueId: 'kitchen', cover: 'No cover', notes: 'Venue inferred from Kitchen Cafe evening slot' },
  { id: 'e0812-3', date: '2026-08-12', startTime: '18:00', endTime: '21:30', artist: 'Philip Kappaz', venueId: 'dakotas' },
  { id: 'e0812-4', date: '2026-08-12', startTime: '20:00', endTime: '23:00', artist: 'Shelley Carrol Quintet', venueId: 'revelers', cover: '$6 cover', musicians: 'Shelley Carrol, Bobby Ray Sparks, Todd Parsnow, Jamil Byrom, Drew Phelps' },
  { id: 'e0812-5', date: '2026-08-12', startTime: '20:15', endTime: '00:00', artist: 'Elite Jazz Jam', venueId: 'balcony', cover: '$5 music fee', musicians: 'John Adams, William Foley & Sean McCurley hosting' },

  // Aug 13 (July 13 lines in source treated as Aug typos)
  { id: 'e0813-1', date: '2026-08-13', startTime: '19:00', endTime: '22:00', artist: 'Kim Platko / Jason Jones', venueId: 'guitars-growlers', notes: 'Guitar duo' },
  { id: 'e0813-2', date: '2026-08-13', startTime: '18:30', endTime: '22:00', artist: 'Erik Barnes / Jeff Robbins Duo', venueId: 'library-bar' },
  { id: 'e0813-3', date: '2026-08-13', startTime: '19:00', endTime: '22:00', artist: 'Linny Nance & Network', venueId: 'free-man', cover: '$10 cover' },
  { id: 'e0813-4', date: '2026-08-13', startTime: '19:00', endTime: '23:00', artist: 'Bishop Avenue Hot 6', venueId: 'revelers', cover: '$6 cover', notes: "Roaring 20's and 30's traditional jazz" },
  { id: 'e0813-5', date: '2026-08-13', startTime: '22:00', endTime: '01:30', artist: 'GJQ (Big Ass Brass Band members)', venueId: 'free-man', cover: '$10 cover' },
  { id: 'e0813-6', date: '2026-08-13', startTime: '19:30', artist: 'Savoy Swing Band', venueId: 'kitchen', cover: '$20 cover' },
  { id: 'e0813-7', date: '2026-08-13', startTime: '20:00', artist: 'Heather Paterson – Tribute to Ella Fitzgerald', venueId: 'scat', musicians: 'Tony Palos – piano, James Driscoll – bass, Steve Barnes & Karl Lampman – drums', ticketUrl: 'https://scatjazzlounge.com' },

  // Aug 14
  { id: 'e0814-1', date: '2026-08-14', startTime: '20:00', endTime: '22:00', artist: 'Gene Glover Quartet', venueId: 'stoneys', notes: 'Ticketed event', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0814-2', date: '2026-08-14', startTime: '20:00', artist: 'Sheron Goodspeed Keyton', venueId: 'scat', notes: 'Ticketed event', ticketUrl: 'https://scatjazzlounge.com' },
  { id: 'e0814-3', date: '2026-08-14', startTime: '19:30', artist: 'Shelley Carrol Jazz Quartet', venueId: 'kitchen', cover: '$20 cover' },
  { id: 'e0814-4', date: '2026-08-14', startTime: '19:00', endTime: '22:00', artist: "Joel Pipkin's World Jazz Project", venueId: 'resident', cover: 'No cover', notes: 'Reservations: (972) 685-5280' },

  // Aug 15
  { id: 'e0815-1', date: '2026-08-15', startTime: '19:30', artist: 'Vic Duncan Band', venueId: 'kitchen', cover: '$20 cover' },
  { id: 'e0815-2', date: '2026-08-15', startTime: '14:00', endTime: '17:00', artist: "Reveler's Hall Band", venueId: 'revelers' },
  { id: 'e0815-3', date: '2026-08-15', startTime: '20:00', endTime: '22:00', artist: 'Duriyie', venueId: 'stoneys', musicians: 'Jeff Plant, Tony Palos, Efren Guzman', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0815-4', date: '2026-08-15', startTime: '20:00', artist: 'Stefan Karlsson – Tribute to Chick Corea', venueId: 'scat', musicians: 'Chris Milyo – sax, Brian Mulholland – bass, Steve Pruitt', ticketUrl: 'https://scatjazzlounge.com' },

  // Aug 16
  { id: 'e0816-1', date: '2026-08-16', startTime: '12:00', endTime: '15:00', artist: 'Sunday Brunch with The Lone Star Organ Trio', venueId: 'stoneys', cover: 'No cover', musicians: 'Eric Scortia – organ, Gregg A. Smith, Andrew Griffith', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0816-2', date: '2026-08-16', startTime: '13:00', endTime: '15:00', artist: 'Deanna Self', venueId: 'central-market-southlake', musicians: 'Mike Garvey – piano, Evan Tom – bass' },
  { id: 'e0816-3', date: '2026-08-16', startTime: '20:00', endTime: '23:00', artist: 'The Fisher Quartet – A Listening Experience', venueId: 'balcony', cover: 'No cover' },
  { id: 'e0816-4', date: '2026-08-16', startTime: '20:00', artist: 'Black Dog Jam', venueId: 'scat', notes: 'Ticketed event', ticketUrl: 'https://scatjazzlounge.com' },
  { id: 'e0816-5', date: '2026-08-16', startTime: '19:00', artist: 'Rebel Alliance Jazz Ensemble', venueId: 'rodeo-city' },

  // Aug 17
  { id: 'e0817-1', date: '2026-08-17', startTime: '19:00', endTime: '21:30', artist: 'Memphis Brass', venueId: 'memphis', cover: 'No cover', notes: 'No reservations – arrive early for seats' },
  { id: 'e0817-2', date: '2026-08-17', startTime: '20:00', endTime: '23:00', artist: 'Red Beans and Rice with Terrance Bradford', venueId: 'revelers', cover: '$6 cover' },

  // Aug 18
  { id: 'e0818-1', date: '2026-08-18', startTime: '16:00', endTime: '18:00', artist: 'Paul Metzger – Happy Hour', venueId: 'steves' },
  { id: 'e0818-2', date: '2026-08-18', startTime: '19:00', endTime: '23:00', artist: 'Todd Blalock and The Terraplane Rounders', venueId: 'revelers' },

  // Aug 19
  { id: 'e0819-1', date: '2026-08-19', startTime: '16:00', endTime: '18:00', artist: 'Kelly Durbin – Happy Hour', venueId: 'steves' },
  { id: 'e0819-2', date: '2026-08-19', startTime: '18:00', endTime: '21:30', artist: 'Philip Kappaz', venueId: 'dakotas' },
  { id: 'e0819-3', date: '2026-08-19', startTime: '20:00', endTime: '23:00', artist: 'Shelley Carrol Quintet', venueId: 'revelers', cover: '$6 cover', musicians: 'Shelley Carrol, Bobby Ray Sparks, Todd Parsnow, Jamil Byrom, Drew Phelps' },
  { id: 'e0819-4', date: '2026-08-19', startTime: '20:15', endTime: '00:00', artist: 'Elite Jazz Jam', venueId: 'balcony', cover: '$5 music fee', musicians: 'John Adams, William Foley & Sean McCurley hosting' },
  { id: 'e0819-5', date: '2026-08-19', startTime: '19:30', endTime: '22:00', artist: 'Rosanna Eckert Night', venueId: 'kitchen', cover: 'No cover', notes: 'Sit-ins and singalongs' },
  { id: 'e0819-6', date: '2026-08-19', startTime: '20:15', endTime: '00:00', artist: 'Elite Jazz Jam (alt listing)', venueId: 'balcony', cover: '$5 music fee', musicians: 'William Foley & Sean McCurley hosting; James Driscoll subbing on bass', notes: 'Second Elite Jam listing for same night in source email' },

  // Aug 20 (Melissa Epps listed as “Th Aug 19” — Thursday is the 20th)
  { id: 'e0820-1', date: '2026-08-20', startTime: '19:30', artist: 'Melissa Epps with Milo Deering', venueId: 'kitchen', cover: '$20 cover' },
  { id: 'e0820-2', date: '2026-08-20', startTime: '19:30', artist: 'Matthew Banks & Friends', venueId: 'eisemann', cover: '$25 / $20 / $15 (students $10)', notes: 'Early jazz & swing on vintage instruments. Bank of America Theatre with cabaret tables.', ticketUrl: 'https://www.eisemanncenter.com/events-tickets/eisemann-center-jazz/' },
  { id: 'e0820-3', date: '2026-08-20', startTime: '19:00', endTime: '22:00', artist: 'The John Adams Electric Trio plus 1', venueId: 'sundance', cover: 'No cover', musicians: 'John Adams, Stefan Karlsson, Matthew Babineaux, Jason Smith', notes: 'Weather backup: Pavilion on east end of plaza' },
  { id: 'e0820-4', date: '2026-08-20', startTime: '20:00', artist: 'Dave Monsch Quartet – Tribute to Ella Fitzgerald', venueId: 'scat', ticketUrl: 'https://scatjazzlounge.com' },

  // Aug 21
  { id: 'e0821-1', date: '2026-08-21', startTime: '19:30', artist: 'W T Greer', venueId: 'kitchen', cover: '$20 cover' },
  { id: 'e0821-2', date: '2026-08-21', startTime: '19:00', artist: 'Mark Lettieri Group', venueId: 'windmills', cover: '$37.50 table / $25 bar', ticketUrl: 'https://windmills-craftworks.turntabletickets.com/r/mark-lettieri-group' },
  { id: 'e0821-3', date: '2026-08-21', startTime: '20:00', endTime: '22:00', artist: 'Pete Brewer / Dennis Dotson Quintet', venueId: 'stoneys', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0821-4', date: '2026-08-21', startTime: '20:00', artist: 'Ricki Derek and his Big Band', venueId: 'scat', ticketUrl: 'https://scatjazzlounge.com' },

  // Aug 22
  { id: 'e0822-1', date: '2026-08-22', startTime: '19:00', artist: 'Mark Lettieri Group', venueId: 'windmills', cover: '$37.50 table / $25 bar', ticketUrl: 'https://windmills-craftworks.turntabletickets.com/r/mark-lettieri-group' },
  { id: 'e0822-2', date: '2026-08-22', startTime: '14:00', endTime: '17:00', artist: 'Kim Platko / Jason Jones', venueId: 'lonestar-wine', notes: 'Guitar duo' },
  { id: 'e0822-3', date: '2026-08-22', startTime: '19:30', endTime: '22:00', artist: 'Gabe Meadows and the Lush Life Trio', venueId: 'kitchen', cover: '$20 cover' },
  { id: 'e0822-4', date: '2026-08-22', startTime: '20:00', endTime: '22:00', artist: 'David Friesen with Paul Lees and Conner Kent', venueId: 'stoneys', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0822-5', date: '2026-08-22', startTime: '20:00', artist: 'Matthew Banks Quintet', venueId: 'scat', ticketUrl: 'https://scatjazzlounge.com' },

  // Aug 23
  { id: 'e0823-1', date: '2026-08-23', startTime: '12:00', endTime: '15:00', artist: 'Sunday Brunch with the Lone Star Organ Trio', venueId: 'stoneys', cover: 'No cover', musicians: 'Eric Scortia, Gregg A. Smith, Andrew Griffith', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0823-2', date: '2026-08-23', startTime: '18:00', endTime: '19:00', artist: 'Stonebriar Jazz Orchestra', venueId: 'stonebriar' },
  { id: 'e0823-3', date: '2026-08-23', startTime: '20:00', artist: 'Black Dog Jam', venueId: 'scat', ticketUrl: 'https://scatjazzlounge.com' },

  // Aug 25
  { id: 'e0825-1', date: '2026-08-25', startTime: '18:00', endTime: '20:00', artist: 'Rebecca Cordes – Piano Night', venueId: 'windmills' },

  // Aug 26
  { id: 'e0826-1', date: '2026-08-26', startTime: '19:30', endTime: '22:00', artist: 'Tony Hakim and Milo Deering', venueId: 'kitchen', cover: 'No cover' },
  { id: 'e0826-2', date: '2026-08-26', startTime: '20:15', endTime: '00:00', artist: 'Elite Jazz Jam', venueId: 'balcony', cover: '$5 music fee', musicians: 'John Adams, William Foley & Sean McCurley hosting' },

  // Aug 27
  { id: 'e0827-1', date: '2026-08-27', startTime: '19:00', endTime: '22:00', artist: 'Carolyn Lee Jones & The Satin Dolls Band', venueId: 'la-stella', musicians: 'Carolyn Lee Jones – vocal, Rebecca Cordes – keys, Peggy Honea – bass, Natalie Wagner – sax/flute, Ann MacMillan – drums' },
  { id: 'e0827-2', date: '2026-08-27', startTime: '19:30', endTime: '22:00', artist: 'The John Adams Trio with Rosana Eckert – Music from the Movies', venueId: 'kitchen', cover: '$20 cover', notes: '4th Thursday series. Reservations recommended.', musicians: 'John Adams, Rosana Eckert, Rowan Barcham, Sean McCurley' },
  { id: 'e0827-3', date: '2026-08-27', startTime: '20:00', artist: 'Pete Clagett – Musings of Miles', venueId: 'scat', ticketUrl: 'https://scatjazzlounge.com' },

  // Aug 28
  { id: 'e0828-1', date: '2026-08-28', startTime: '19:00', endTime: '22:00', artist: 'Kim Platko / Jason Jones', venueId: 'resident', notes: 'Guitar duo' },
  { id: 'e0828-2', date: '2026-08-28', startTime: '19:30', artist: 'Kyle Jenkins Trio', venueId: 'kitchen', cover: '$20 cover' },
  { id: 'e0828-3', date: '2026-08-28', startTime: '20:00', artist: 'Randy Lee and the Jazz Giants', venueId: 'stoneys', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0828-4', date: '2026-08-28', startTime: '20:00', artist: 'Quamon Fowler – Musings of Miles', venueId: 'scat', ticketUrl: 'https://scatjazzlounge.com' },
  { id: 'e0828-5', date: '2026-08-28', startTime: '19:00', endTime: '21:30', artist: "Joel Pipkin's World Jazz Project", venueId: 'cafe-madrid', cover: 'No cover', notes: 'Reserve near the band: (214) 528-1731' },

  // Aug 29
  { id: 'e0829-1', date: '2026-08-29', startTime: '19:30', artist: 'Stockton Helbing Jazz Initiative', venueId: 'kitchen', cover: '$20 cover' },
  { id: 'e0829-2', date: '2026-08-29', startTime: '20:00', endTime: '22:00', artist: 'Damoyee', venueId: 'stoneys', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0829-3', date: '2026-08-29', startTime: '20:00', artist: 'Quamon Fowler', venueId: 'scat', ticketUrl: 'https://scatjazzlounge.com' },

  // Aug 30
  { id: 'e0830-1', date: '2026-08-30', startTime: '12:00', endTime: '15:00', artist: 'Sunday Brunch with the Lone Star Organ Trio', venueId: 'stoneys', cover: 'No cover', musicians: 'Eric Scortia, Gregg A. Smith, Andrew Griffith', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0830-2', date: '2026-08-30', startTime: '20:00', artist: 'Black Dog Jam', venueId: 'scat', ticketUrl: 'https://scatjazzlounge.com' },

  // Sept
  { id: 'e0903-1', date: '2026-09-03', startTime: '19:30', artist: 'Carolyn Lee Jones – Acoustic Montage', venueId: 'kitchen', cover: '$20 cover', notes: 'Highlights from six CD releases. Reservations: 972-818-3400', musicians: 'Carolyn Lee Jones – vocal, Roland Elbert – piano, Henry Beal – bass' },
  { id: 'e0904-1', date: '2026-09-04', startTime: '19:00', endTime: '22:00', artist: 'Kim Platko / Jason Jones / Nathan Phelps', venueId: 'wine-haus' },
  { id: 'e0904-2', date: '2026-09-04', startTime: '20:00', endTime: '22:00', artist: 'Carolyn Lee Jones & The Satin Dolls Band', venueId: 'stoneys', cover: '$15 cover', musicians: 'Rebecca Cordes, Peggy Honea, Sheri Gomez, Ann MacMillan', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0906-1', date: '2026-09-06', startTime: '19:00', endTime: '21:00', artist: 'Larry Spencer and Rock Ridge Big Band', venueId: 'rodeo-city', cover: 'No cover' },
  { id: 'e0907-1', date: '2026-09-07', startTime: '19:00', artist: 'Jam Session hosted by Eric Hitt', venueId: 'windmills', notes: 'House Band at 7:00 & Jam at 7:45' },
  { id: 'e0912-1', date: '2026-09-12', startTime: '14:00', endTime: '17:00', artist: 'Kim Platko / Jacob Cortez', venueId: 'lonestar-wine', notes: 'Guitar & violin' },
  { id: 'e0917-1', date: '2026-09-17', startTime: '19:30', endTime: '21:30', artist: 'The Astrid Merriman Cabaret & Cabernet Fete', venueId: 'sammons', cover: '$45 members / $50 non-members', notes: 'Carolyn Lee Jones and other vocalists' },
  { id: 'e0919-1', date: '2026-09-19', startTime: '19:00', artist: 'Everything Yes', venueId: 'windmills', cover: '$30 table / $20 bar', ticketUrl: 'https://windmills-craftworks.turntabletickets.com/shows/11981/?date=2026-09-19' },
  { id: 'e0919-2', date: '2026-09-19', startTime: '20:00', artist: 'Dr. Mike Bogle Trio', venueId: 'stoneys', musicians: 'Dr. Mike Bogle – piano/vocals, Buddy Mohamed – bass, Gene Glover – drums', ticketUrl: 'https://stoneyswinelounge.com' },
  { id: 'e0925-1', date: '2026-09-25', startTime: '19:00', artist: 'Sam Greenfield', venueId: 'windmills', cover: '$35 table / $25 bar', ticketUrl: 'https://windmills-craftworks.turntabletickets.com/r/sam-greenfield' },
  { id: 'e0926-1', date: '2026-09-26', startTime: '20:30', endTime: '00:00', artist: 'Carolyn Lee Jones & The Satin Dolls Quartet', venueId: 'mansion', musicians: 'Rebecca Cordes – piano, Claudia Easterwood – bass, special guest sax' },
  { id: 'e0926-2', date: '2026-09-26', startTime: '19:00', artist: 'Sam Greenfield', venueId: 'windmills', cover: '$35 table / $25 bar', ticketUrl: 'https://windmills-craftworks.turntabletickets.com/r/sam-greenfield' },
  { id: 'e0928-1', date: '2026-09-28', startTime: '20:00', endTime: '00:00', artist: 'Kay and Kent Ellingson', venueId: 'balcony', cover: 'No cover', musicians: 'Alan Green – drums, Karl Lampman – sax/flute, Mark Wilson – bass' },

  // Oct
  { id: 'e1015-1', date: '2026-10-15', startTime: '19:30', artist: 'Kay Ellingson – 100 Years of Hits', venueId: 'sammons', notes: 'Sammons Cabaret Series with Kent Ellingson – piano' },
  { id: 'e1024-1', date: '2026-10-24', startTime: '19:00', artist: 'Gunhild Carling with Texins Jazz Band', venueId: 'eisemann', cover: '$11–$34', ticketUrl: 'https://www.eisemanncenter.com/event/?i=12155' },
];

export const ongoing: OngoingSeries[] = [
  { id: 'o1', title: 'The Fisher Quartet – A Listening Experience', schedule: 'Every Sunday · 8:00–11:00 pm', venueId: 'balcony', cover: 'No cover', url: 'https://www.balconyclub.com/' },
  { id: 'o2', title: 'Larry Spencer and Rock Ridge Big Band', schedule: 'First Sunday · 7:00–9:00 pm', venueId: 'rodeo-city', cover: '$5 cover' },
  { id: 'o3', title: 'Galen Jeter and Dallas Jazz Orchestra', schedule: '2nd & 4th Sundays · 7:00–9:00 pm', venueId: 'rodeo-city', cover: '$5 cover' },
  { id: 'o4', title: 'Rebel Alliance Jazz Ensemble', schedule: 'Third Sunday · 7:00–9:00 pm', venueId: 'rodeo-city', cover: '$5 cover' },
  { id: 'o5', title: 'JAZZ LIVES! with Bob Dauber', schedule: 'Every Monday · 8:00–10:00 pm CT (live from Chicago)', notes: 'Stream at lakesradio.org or say “Play WLCB”', url: 'https://www.lakesradio.org' },
  { id: 'o6', title: 'Memphis Brass', schedule: '1st & 3rd Mondays · 7:00–9:30 pm', venueId: 'memphis', cover: 'No cover' },
  { id: 'o7', title: 'Terraplane Rounders', schedule: 'Every Tuesday · 7:00–11:00 pm', venueId: 'revelers', cover: '$5 cover', notes: 'Prewar & depression-era blues, traditional jazz, ragtime' },
  { id: 'o8', title: 'JAZZ LIVES! rebroadcast', schedule: 'Every Wednesday · noon–2:00 pm' },
  { id: 'o9', title: 'Elite Jazz Jam', schedule: 'Every Wednesday · 8:15–11:00 pm', venueId: 'balcony', cover: 'No cover (ongoing listing)' },
  { id: 'o10', title: 'Shelley Carrol Quintet', schedule: 'Every Wednesday · 8:00–11:00 pm', venueId: 'revelers' },
  { id: 'o11', title: 'Erik Barnes / Jeff Robbins Duo', schedule: 'Every Thursday · 6:30–10:00 pm', venueId: 'library-bar' },
  { id: 'o12', title: 'Linny Nance & Network', schedule: 'Every Thursday · 7:00 pm', venueId: 'free-man', cover: '$10 cover' },
  { id: 'o13', title: 'Shango', schedule: 'Every Thursday · 8:00–11:00 pm', venueId: 'regines', notes: 'Todd Parsnow, Larry Davis, Jeff Plant, Mauricio Barroso' },
  { id: 'o14', title: 'GJQ', schedule: 'Every Thursday · 10:00 pm–1:30 am', venueId: 'free-man', cover: '$10 cover' },
  { id: 'o15', title: 'John Adams Electric Trio', schedule: '2nd Thursday · 8:00–11:00 pm', venueId: 'scat', url: 'http://scatjazzlounge.com' },
  { id: 'o16', title: 'John Adams Electric Trio with Rob Holbert', schedule: '3rd Thursday · 9:30 pm–12:30 am', venueId: 'balcony', cover: '$5 cover' },
  { id: 'o17', title: 'Jazz Night with The John Adams Trio', schedule: '4th Thursday · 7:30–10:30 pm', venueId: 'kitchen', cover: '$20 cover' },
  { id: 'o18', title: "Joel Pipkin's World Jazz Project", schedule: '1st & 2nd Fridays · 7:00–10:00 pm', venueId: 'resident', cover: 'No cover' },
  { id: 'o19', title: "Joel Pipkin's World Jazz Project", schedule: '3rd & last Fridays · 7:00–9:30 pm', venueId: 'cafe-madrid', cover: 'No cover' },
  { id: 'o20', title: 'Melani Skybell', schedule: 'Every Saturday · 6:00–10:00 pm', venueId: 'table-13' },
];

export const editionLabel = 'Aug. 2026 jazz events # 3';
