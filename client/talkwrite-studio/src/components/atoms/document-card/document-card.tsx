import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/use-auth";
import DocumentInterface from "../../../types/interfaces/document";
import { MouseEvent } from "react";
import DocumentMenuButton from "../document-menu-button/document-menu-button";
import Logo from "../logo/logo";

interface DocumentCardProps {
  document: DocumentInterface;
  setDocuments: Function;
}

const DocumentCard = ({ document, setDocuments }: DocumentCardProps) => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const handleDocumentBtnClick = (
    event: MouseEvent<HTMLDivElement>,
    documentId: number
  ) => {
    const classList = (event.target as HTMLDivElement).classList;
    if (
      !classList.contains(`document-menu-btn-${documentId}`) &&
      !classList.contains("document-menu")
    ) {
      navigate(`/document/${documentId}`);
    }
  };

  const skeleton = (
    <>
      {Array.from({ length: 18 }, (x, i) => i).map((i) => {
        return (
          <div
            key={i}
            style={{ width: `${Math.floor(Math.random() * 100)}%` }}
            className="h-1 bg-gray-200"
          ></div>
        );
      })}
    </>
  );

  return (
    <div
      onClick={(event) => handleDocumentBtnClick(event, document.id)}
      key={document.id}
      className="text-left cursor-pointer"
    >
      <div className="h-81 w-full border flex flex-col justify-between hover:border-blue-500 rounded">
        <div className="w-full h-full p-4 flex flex-col space-y-2">
          {skeleton}
        </div>
        <div className="w-full h-24 border-t p-3">
          <h6 className="text-sm max-w-full truncate">{document.title}</h6>
          <div className="flex items-center justify-between">
            <div className="relative flex items-center">
              <Logo/>
              <p className="text-xs text-gray-400 relative right-0">
                {new Date(document.updatedAt).toLocaleDateString("en-US", {
                  month:"short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            {document.userId === userId && (
              <DocumentMenuButton
                documentId={document.id}
                setDocuments={setDocuments}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;