"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { Button } from "@/components/ui/button";

interface Link {
  _id: string;
  title: string;
  link: string;
  tags: string[];
  createdAt: string;
}

const Linkcard = ({ link ,onLinkDeleted }: any) => {
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.post("/api/links/delete-link", { link_id: id });
      if (res.data.success) {
        toast({
          title: "Link deleted successfully",
          description: "Your link has been deleted successfully",
        });
      }
      onLinkDeleted(id as String);
    } catch (err:any) {
        toast({
          title: 'Error',
          description:
            err.response?.data.message ?? 'Failed to delete message',
          variant: 'destructive',
        });
    }
  };

  return (
    <div>
      <motion.div
        key={link._id}
        className="bg-white shadow-md rounded-lg p-6"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-2">{link.title}</h2>
        <a
          href={link.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline break-all"
        >
          {link.link}
        </a>
        <p className="text-gray-600 text-sm mt-2">
          {new Date(link.createdAt).toLocaleString()}
        </p>
        <div className="mt-3">
          {link.tags.map((tag: any) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              {tag}
            </span>
          ))}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild className="mt-5">
            <Button variant={"default"}>Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(link._id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
};

export default Linkcard;
