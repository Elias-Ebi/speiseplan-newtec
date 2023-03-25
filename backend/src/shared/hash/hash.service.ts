import { Injectable } from "@nestjs/common";
import { BinaryToTextEncoding, createHash, timingSafeEqual } from "crypto";

@Injectable()
export class HashService {
    
    private encryptionStandard: string[] = ["sha128", "sha256", "sha512"];

    public encrypt(data: string, encryptionStandardIndex: number, encryptionBase: BinaryToTextEncoding): string {
        return createHash(this.encryptionStandard[encryptionStandardIndex]).update(data).digest(encryptionBase);
    }

    public timeSafeEqual(data1: string, data2: string): boolean {
        return timingSafeEqual(Buffer.from(data1), Buffer.from(data2));
    }
}