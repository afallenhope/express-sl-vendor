import { DOMParser, XMLSerializer } from 'xmldom';
export class ShapeCombinerHelper {
  private static bodyIds: number[] = [33, 34, 637, 11001];
  private static torsoIds: number[] = [649, 678, 683, 756, 36, 105, 507, 684, 685, 693, 675, 38, 676, 157];
  private static legsIds: number[] = [652, 692, 37, 842, 795, 879, 753, 841, 515];

  static parseXml(xmlString: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(xmlString, 'text/xml');
  }

  static serializeXml(xml: Document): string {
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xml);
  }

  static getArchetypeNode(xml: Document): Element {
    const nodes = xml.getElementsByTagName('archetype');

    if (!nodes.length) {
      throw new Error('Invalid XML: missing <archetype> node.');
    }

    return nodes[0];
  }

  static getShapeNode(id: number, xml: Document): Element {
    const nodes = xml.getElementsByTagName('param');

    for (let i = 0; i < nodes.length; i++) {
      const attr = nodes[i].getAttribute('id');
      if (attr !== null && Number(attr) === id) {
        return nodes[i];
      }
    }

    throw new Error(`Shape node with id ${id} not found.`);
  }

  static deleteShapeNode(nodeId: number, target: Document): void {
    const node = this.getShapeNode(nodeId, target);
    node.parentNode?.removeChild(node);
  }

  static addShapeNodeFromSource(nodeId: number, source: Document, target: Document): void {
    const targetArchetype = this.getArchetypeNode(target);
    const sourceNode = this.getShapeNode(nodeId, source);

    // Import to avoid cross-document DOM issues
    const imported = target.importNode(sourceNode, true);
    targetArchetype.appendChild(imported);
  }

  static replaceShapeNodes(nodeIds: number[], source: Document, target: Document): void {
    nodeIds.forEach((id) => {
      this.deleteShapeNode(id, target);
      this.addShapeNodeFromSource(id, source, target);
    });
  }

  static hasParseError(doc: Document): boolean {
    return doc.getElementsByTagName('parsererror').length > 0;
  }

  static mergeShapes(headXmlString: string, bodyXmlString: string): string {
    const headXml = this.parseXml(headXmlString);
    const bodyXml = this.parseXml(bodyXmlString);

    if (ShapeCombinerHelper.hasParseError(headXml) || ShapeCombinerHelper.hasParseError(bodyXml)) {
      throw new Error('Error parsing XML strings.');
    }

    this.replaceShapeNodes(this.bodyIds, bodyXml, headXml);
    this.replaceShapeNodes(this.torsoIds, bodyXml, headXml);
    this.replaceShapeNodes(this.legsIds, bodyXml, headXml);

    return this.serializeXml(headXml);
  }
}
