// Static image asset URLs and imports that work seamlessly in development and production builds
import facadeImg from './r2_building_facade_1786033110102.jpg';
import livingRoomImg from './interior_living_room_1786033121497.jpg';
import bedroomImg from './interior_bedroom_1786033133480.jpg';
import logoImg from './magha_logo_1786471125430.jpg';

export const ASSETS = {
  logo: logoImg || '/assets/images/magha_logo_1786471125430.jpg',
  facade: facadeImg || '/assets/images/r2_building_facade_1786033110102.jpg',
  livingRoom: livingRoomImg || '/assets/images/interior_living_room_1786033121497.jpg',
  bedroom: bedroomImg || '/assets/images/interior_bedroom_1786033133480.jpg',
};
