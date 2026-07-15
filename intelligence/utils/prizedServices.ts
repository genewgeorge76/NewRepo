export interface PrizedService {
  tag: string;
  margin: string;
  visualProof: string;
}

export const prizedServices: Record<string, PrizedService> = {
  grading: {
    tag: 'SUBGRADE-PRECISION',
    margin: '23%',
    visualProof: 'Laser-grade elevation report',
  },
  striping: {
    tag: 'ADA-COMPLIANCE',
    margin: '29%',
    visualProof: 'Final striping and stall-count photos',
  },
  milling: {
    tag: 'SURFACE-RESET',
    margin: '26%',
    visualProof: 'Milling depth verification photos',
  },
  sealcoating: {
    tag: 'LIFECYCLE-PROTECT',
    margin: '31%',
    visualProof: 'Before/after finish comparison',
  },
  patching: {
    tag: 'STRUCTURAL-REPAIR',
    margin: '24%',
    visualProof: 'Core repair and compaction logs',
  },
  'chip and tar': {
    tag: 'RURAL-DURABILITY',
    margin: '27%',
    visualProof: 'Aggregate embedment footage',
  },
};
