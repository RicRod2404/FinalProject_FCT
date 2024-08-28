package pt.unl.fct.di.adc.adc2024.services;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

@Component
@RequiredArgsConstructor
@Async
public class StorageService {

    private final Storage storage;

    private static final String bucketName = "treapapp.appspot.com";

    private static final String storageURL = "https://storage.googleapis.com/";

    public enum Folder {

        PROFILE_PICS("profilepics/"),

        BANNERS("banners/"),

        PRODUCTS("products/"),

        COMMUNITIES("communities/");

        private final String value;

        Folder(String string) {
            this.value = string;
        }

        public String getValue() {
            return value;
        }

        @Override
        public String toString() {
            return value;
        }
    }

    public Future<String> uploadFile(String objectName, Folder folder, MultipartFile file) {
        BlobId blobID = BlobId.of(bucketName, folder.toString() + objectName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobID).setCacheControl("no-cache,max-age=0").build();
        try {
            storage.create(blobInfo, file.getBytes(), Storage.BlobTargetOption.predefinedAcl(Storage.PredefinedAcl.PUBLIC_READ));
            return CompletableFuture.completedFuture(storageURL + bucketName + "/" + folder + objectName);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public void deleteFile(String objectName, Folder folder) {
        BlobId blobID = BlobId.of(bucketName, folder.toString() + objectName);
        try {
            storage.delete(blobID);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Future<String> getFileURL(String objectName, Folder folder) {
        try {
            var blob = storage.get(BlobId.of(bucketName, folder.toString() + objectName));
            if (blob != null)
                return CompletableFuture.completedFuture(storageURL + bucketName + "/" + folder + objectName);
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Future<byte[]> downloadFile(String objectName, Folder folder) {
        BlobId blobID = BlobId.of(bucketName, folder.toString() + objectName);
        try {
            return CompletableFuture.completedFuture(storage.readAllBytes(blobID));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}
