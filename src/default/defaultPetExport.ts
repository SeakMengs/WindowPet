import { IPetParams } from '../types/IPet';
import defaultPetConfig from './pets.json';

export const defaultPetOptions: IPetParams[] = JSON.parse(JSON.stringify(defaultPetConfig));
