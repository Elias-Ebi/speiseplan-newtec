import { Injectable } from "@nestjs/common";
import { BinaryToTextEncoding, createHash } from "crypto";

@Injectable()
export class HashService {
    
    private encryptionStandard: string[] = ["sha128", "sha256", "sha512"];

    public encrypt(data: string, encryptionStandardIndex: number, encryptionBase: BinaryToTextEncoding): string {
        return createHash(this.encryptionStandard[encryptionStandardIndex]).update(data).digest(encryptionBase);
    }
}