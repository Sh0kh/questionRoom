import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
} from "@material-tailwind/react";

export default function FinishModal({ open, onClose, onConfirm }) {
    return (
        <Dialog
            open={open}
            handler={onClose}
            size="sm"
            className="rounded-2xl shadow-xl"
        >
            <DialogHeader className="text-xl font-semibold text-gray-800">
                ❓ Testni tugatmoqchimisiz?
            </DialogHeader>

            <DialogBody divider className="text-gray-600 text-base">
                Siz testni tugatmoqchisiz. <br />
                Agar tasdiqlasangiz, javoblaringiz saqlanadi va qayta davom etolmaysiz.
            </DialogBody>

            <DialogFooter className="flex gap-3">
                <Button
                    variant="text"
                    color="blue-gray"
                    onClick={onClose}
                    className="rounded-lg"
                >
                    Bekor qilish
                </Button>
                <Button
                    color="red"
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className="rounded-lg shadow-md"
                >
                    Ha, tugataman
                </Button>
            </DialogFooter>
        </Dialog>
    );
}