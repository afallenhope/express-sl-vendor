import { Request, Response } from 'express';
import { ShapeCombinerHelper } from '../helpers/ShapeCombinerHelper';

interface FormDataField {
  [key: string]: string | FileData;
}

interface FileData {
  filename: string;
  content: string;
}

export class ToolController {
  parseMultipartFormData = (req: Request): Promise<FormDataField> => {
    return new Promise((resolve, reject) => {
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.startsWith('multipart/form-data; boundary=')) {
        reject(new Error('Content-Type must be multipart/form-data'));
        return;
      }

      const boundary = `--${contentType.split('boundary=')[1]}`;
      let body = '';

      req.on('data', (chunk: Buffer) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const parts = body.split(boundary).filter((part) => part.trim() !== '--' && part.trim() !== '');
        const formData: FormDataField = {};

        parts.forEach((part) => {
          const [header, content] = part.split('\r\n\r\n');
          const dispositionMatch = header.match(/Content-Disposition: form-data; name="(.+?)"(; filename="(.+?)")?/);

          if (dispositionMatch) {
            const name = dispositionMatch[1];
            const filename = dispositionMatch[3];

            if (filename) {
              // Handle file content
              const fileContent = content.trim();
              formData[name] = {
                filename,
                content: fileContent,
              };
            } else {
              // Handle regular form field
              formData[name] = content.trim();
            }
          }
        });

        resolve(formData);
      });

      req.on('error', (err) => {
        reject(err);
      });
    });
  };

  async combineShape(req: Request, res: Response) {
    try {
      const formData = await this.parseMultipartFormData(req);

      if (!formData.headFile || !formData.bodyFile) {
        return res.status(400).json({ error: 'Missing head or body xml files.' });
      }

      const headFile = formData.headFile as FileData;
      const bodyFile = formData.bodyFile as FileData;

      const combined = ShapeCombinerHelper.mergeShapes(headFile.content, bodyFile.content);

      // console.log('Parsed form data', formData);
      return { status: 200, message: { combinedshape: combined } };
    } catch (e) {
      console.log(e);
      return { status: 500, error: e };
    }
  }
}
