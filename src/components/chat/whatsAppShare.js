export async function shareImageToWhatsApp(imageUrl, role) {
    try {
        // Fetch the image as a blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Create a File from the blob
        const file = new File(
            [blob],
            role === 'user' ? 'uploaded-image.jpg' : 'ghibli-image.jpg',
            { type: blob.type }
        );

        // Prepare the caption including the extra link to generate more
        const caption =
            role === 'user'
                ? 'Check out this image! Generate more at https://thetidbit.in/chat'
                : 'Check out this Ghibli-style image I created! Generate more at https://thetidbit.in/chat';

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            // Share both the image and the text using the Web Share API
            await navigator.share({
                files: [file],
                title: role === 'user' ? 'My Uploaded Image' : 'My Ghibli-Style Image',
                text: caption
            });
        } else {
            // Fallback: open WhatsApp with the image URL and the caption for generating more
            window.open(
                "https://wa.me/?text=" +
                    encodeURIComponent(`${caption} \n\n${imageUrl}`),
                "_blank"
            );
        }
    } catch (error) {
        console.error("Error sharing image via WhatsApp:", error);
        // Fallback on error as well
        window.open(
            "https://wa.me/?text=" +
                encodeURIComponent(`${caption} \n\n${imageUrl}`),
            "_blank"
        );
    }
}