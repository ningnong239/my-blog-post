// โค้ดนี้เป็นชุด component React สำหรับ "Alert Dialog" (กล่องข้อความแจ้งเตือน/ยืนยัน)
// ซึ่งสร้างบนฐานของ Radix UI Alert Dialog Primitive ทำให้ปรับแต่งหน้าตาและฟังก์ชันได้สะดวก
// และสามารถนำไปใช้ได้ซ้ำในหลายจุดของโปรเจ็ค

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils" // ฟังก์ชันรวม className
import { buttonVariants } from "@/components/ui/button" // เพื่อปรับปุ่มให้ตรงกับธีม

// สร้าง component หลักจาก Radix
const AlertDialog = AlertDialogPrimitive.Root         // ตัว container หลัก
const AlertDialogTrigger = AlertDialogPrimitive.Trigger // ปุ่มหรือ element สำหรับเปิด dialog
const AlertDialogPortal = AlertDialogPrimitive.Portal   // portal สำหรับเรนเดอร์ dialog ขึ้นเหนือ DOM หลัก

// Overlay คือพื้นหลังมืดตอน dialog เปิด
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      // ให้ overlay เต็มจอสีดำโปร่ง และมี animation เวลาเปิด/ปิด
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref} />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

// Container จริงของเนื้อหา dialog กลางหน้าจอ
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay /> {/* ควรเรนเดอร์ Overlay ด้วยเสมอ */}
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        // ตำแหน่งตรงกลาง, animation, เงา, ขนาด, border
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props} />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

// ส่วนหัวของ dialog (ใช้สำหรับวาง title/heading)
const AlertDialogHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props} />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

// ส่วนท้ายของ dialog (วางปุ่ม action ต่างๆ)
const AlertDialogFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props} />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

// Title ของกล่อง dialog (เช่น "ยืนยันการลบ?")
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

// Description หรือตัวอธิบายความ (ข้อความรองคำถาม)
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

// ปุ่ม action (primary) เช่น "ตกลง", "Delete"
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

// ปุ่ม cancel (secondary) เช่น "ยกเลิก"
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
    {...props} />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

// export ทุก component สำหรับให้หน้าอื่นเรียกใช้แยกส่วนได้
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

